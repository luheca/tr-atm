import os

import flask

from flask import Flask, request
from flask_cors import CORS

from atm.db import get_db


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
    app.config.from_mapping(
        SECRET_KEY='thomson-reuters-atm',
        DATABASE=os.path.join(app.instance_path, 'tr-bank.sqlite'),
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route('/pin', methods=('POST',))
    def pin():
        """
        Receive a PIN.

        Return the corresponding username, token, account number, balance, card_type.
        """
        payload = flask.request.json
        entered_pin = payload["value"]
        db = get_db()

        user_account = db.execute(
            """
            SELECT user_id, username, pin, token, account_number, balance, card_type
            FROM user, account
            WHERE account.pin = ?
            AND user.id = account.user_id""", (entered_pin,)
        ).fetchone()

        if not user_account:
            return flask.jsonify({"message": "Invalid PIN"}), 400

        return flask.jsonify({
            "token": user_account[3],
            "username": user_account[1],
            "account_number": user_account[4],
            "balance": user_account[5],
            "card_type": user_account[6]
        })

    @app.route('/balance', methods=('POST',))
    def balance():
        """
        Retrieve the balance for the given account.
        """
        auth_header = flask.request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return flask.jsonify({"error": "Missing or invalid Authorization header"}), 401

        token = auth_header.split(' ')[1]
        payload = flask.request.json
        account_number = payload["account_number"]
        db = get_db()

        user_account = db.execute(
            """
            SELECT user_id, username, pin, token, account_number, balance, card_type
            FROM user, account
            WHERE user.token = ?
            AND account.user_id = user.id
            AND account.account_number = ?""", (token, account_number)
        ).fetchone()

        return flask.jsonify({
            "username": user_account[1],
            "account_number": user_account[4],
            "balance": user_account[5],
            "card_type": user_account[6]
        })

    @app.route('/withdraw', methods=('POST',))
    def withdraw():
        """
        Withdraw an amount from the given account.
        """
        auth_header = flask.request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return flask.jsonify({"error": "Missing or invalid Authorization header"}), 401

        token = auth_header.split(' ')[1]
        payload = flask.request.json
        account_number = payload["account_number"]
        amount = int(payload["amount"])
        db = get_db()

        user_account = db.execute(
            """
            SELECT user_id, username, pin, token, account_number, balance, card_type
            FROM user, account
            WHERE user.token = ?
            AND account.user_id = user.id
            AND account.account_number = ?""", (token, account_number)
        ).fetchone()
        username = user_account[1]
        card_type = user_account[6]

        current_balance = int(user_account[5])

        if amount > current_balance:
            return flask.jsonify({"message": "Insuficient funds."}), 400

        new_balance = current_balance - amount
        new_balance_str = str(new_balance)
        user_account = db.execute(
            """
            UPDATE account
            SET balance = ?
            WHERE account_number = ?
            AND user_id = ?""", (new_balance_str, user_account[4], user_account[0])
        )
        db.commit()

        return flask.jsonify({
            "username": username,
            "account_number": account_number,
            "balance": new_balance_str,
            "card_type": card_type
        })

    @app.route('/deposit', methods=('POST',))
    def deposit():
        """
        Deposit an amount to the given account.
        """
        auth_header = flask.request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return flask.jsonify({"error": "Missing or invalid Authorization header"}), 401

        token = auth_header.split(' ')[1]
        payload = flask.request.json
        account_number = payload["account_number"]
        amount = int(payload["amount"])
        db = get_db()

        user_account = db.execute(
            """
            SELECT user_id, username, pin, token, account_number, balance, card_type
            FROM user, account
            WHERE user.token = ?
            AND account.user_id = user.id
            AND account.account_number = ?""", (token, account_number)
        ).fetchone()
        username = user_account[1]
        card_type = user_account[6]

        current_balance = int(user_account[5])

        new_balance = current_balance + amount
        new_balance_str = str(new_balance)
        user_account = db.execute(
            """
            UPDATE account
            SET balance = ?
            WHERE account_number = ?
            AND user_id = ?""", (new_balance_str, user_account[4], user_account[0])
        )
        db.commit()

        return flask.jsonify({
            "username": username,
            "account_number": account_number,
            "balance": new_balance_str,
            "card_type": card_type
        })


    from . import db
    db.init_app(app)

    return app
