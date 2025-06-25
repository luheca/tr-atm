DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS account;

CREATE TABLE user (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  token TEXT
);

CREATE TABLE account (
  account_number INTEGER PRIMARY KEY,
  pin TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  balance TEXT NOT NULL,
  card_type TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user (id)
);
