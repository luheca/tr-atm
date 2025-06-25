import React from 'react';

import { useState } from 'react';
import { useEffect } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import CreditCardStrip from './CreditCardStrip';
import Screen from './Screen';
import OverlayScreen from './OverlayScreen';
import useFetch from '@/hooks/useFetch';

import { Account, User, PINResponse } from '../interfaces/User';

export default function ATM() {
    const baseUrl = 'http://127.0.0.1:5000'
    const [apiEndpoint, setAPIEndpoint] = useState<string>("pin");

    const [screenType, setScreenType] = useState<string>("welcome");
    const [overlayOpen, setOverlayOpen] = useState<boolean>(false);

    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [accountForPIN, setAccountForPIN] = useState<Account | null>(null);

    const [fetchToggle, setFetchToggle] = useState<boolean | null>(null);
    const [fetchBody, setFetchBody] = useState<object | null>(null);
    const [bearerToken, setBearerToken] = useState<string | null>(null);

    const { data, loading, error } = useFetch<PINResponse>(
        baseUrl + `/${apiEndpoint}`,
        fetchBody,
        bearerToken,
        fetchToggle
    );

    const closeOverlay = () => {
        setOverlayOpen(false);
    }

    const handleConfirm = (value: string) => {
        setAPIEndpoint('pin');
        setFetchBody({ 'value': value })
        setFetchToggle((prev) => !prev);
        setScreenType("accountOptions");
    };

    const handleExit = () => {
        setLoggedInUser(null);
        setAccountForPIN(null);
        setScreenType("welcome");
    };

    const handleBalance = () => {
        setAPIEndpoint('balance');
        setFetchBody({ 'token': data.token, 'account_number': data.account_number })
        setFetchToggle((prev) => !prev);
        setScreenType("balance");
    }

    const handleGoToScreen = (screen: string) => {
        setScreenType(screen);
    }

    const handleAmount = (action: string, amount: string) => {
        setAPIEndpoint(action);
        setFetchBody({ 'token': data.token, 'account_number': data.account_number, 'amount': amount })
        setFetchToggle((prev) => !prev);
        setScreenType("accountOptions");
    };

    useEffect(() => {
        if (data) {
            setLoggedInUser({
                username: data.username,
                token: data.token
            });
            setAccountForPIN({
                accountNumber: data.account_number,
                balance: data.balance,
                cardType: data.card_type
            });
            if (data.token)
                setBearerToken(data.token);
        }
    }, [data]);

    return (
        <>
            <Stack sx={{ width: "max-content" }}>
                <Box sx={{
                    position: "relative",
                    width: "max-content",
                }} border={"black"}>
                    <Box sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 1,
                    }}>
                        <img
                            src="/atm/atm_sign.png"
                            alt="ATM Sign"
                            width={298}
                            height={122}
                        />
                    </Box>
                    <Box sx={{
                        position: "absolute",
                        top: 20,
                        left: 80,
                        zIndex: 2,
                    }}>
                        <img
                            src="/atm/graffiti.png"
                            alt="Oops, some graffiti"
                            width={207}
                            height={63}
                        />
                    </Box>
                    <Box sx={{ height: 122, width: 300, visibility: "hidden" }} />
                </Box>
                <Box sx={{ height: 10, width: 300 }} />
                <CreditCardStrip creditCardType={accountForPIN?.cardType} />
                <Screen
                    screenType={screenType}
                    user={loggedInUser}
                    account={accountForPIN}
                    setOverlayOpen={setOverlayOpen}
                    handleExit={handleExit}
                    handleBalance={handleBalance}
                    handleGoToScreen={handleGoToScreen}
                    handleAmount={handleAmount}
                    error={error}
                />
                <OverlayScreen open={overlayOpen} label="PIN" handleConfirm={handleConfirm} handleCancel={() => { }} onClose={closeOverlay} />
                <Box sx={{ height: 10, width: 300 }} />
                <Box sx={{
                    position: "relative",
                }} border={"black"}>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ width: "100%" }}>
                        <img
                            src="/atm/sticker_graf.png"
                            alt="Oops, more graffiti"
                            width={158}
                            height={112}
                        />
                        <img
                            src="/atm/systems.png"
                            alt="Systems"
                            width={54}
                            height={6}
                        />
                    </Stack>
                </Box>
                <Box>
                    <Typography variant='body2' sx={{ whiteSpace: 'pre-line' }}>
                        Use these PINs for demo.<br />
                        1234: Luis Herrera - Visa<br />
                        2345: Cuzco Dog - Master Card<br />
                        3456: Pepper Cat - Pulse<br />
                    </Typography>

                </Box>
            </Stack>

        </>
    );
}