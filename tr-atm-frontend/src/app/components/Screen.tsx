import React from 'react';

import { useEffect, useState, useRef } from 'react';

import { Alert, Box, Button, Snackbar, Stack, Typography } from '@mui/material';

import { Account, User } from '../interfaces/User';

interface screenProps {
    screenType: string,
    user: User | null,
    account: Account | null,
    setOverlayOpen: (isOpen: boolean) => any;
    handleExit: () => any;
    handleBalance: () => any;
    handleGoToScreen: (screen: string) => any;
    handleAmount: (action: string, amount: string) => any;
    error: string | null;
}

interface ButtonOption {
    label: string;
    key: number;
    handleClick: () => void;
}

export default function Screen({
    screenType, user, account,
    setOverlayOpen,
    handleExit, handleBalance, handleGoToScreen,
    handleAmount,
    error }: screenProps) {
    const [sbOpen, setSBOpen] = useState<boolean>(false);
    const [sbBalanceOpen, setSBBalanceOpen] = useState<boolean>(false);
    const [mainMessage, setMainMessage] = useState<string>();
    const [leftOptions, setLeftOptions] = useState<ButtonOption[]>([]);
    const [rightOptions, setRightOptions] = useState<ButtonOption[]>([]);

    const prevAccountRef = useRef<number | null>(null);
    const prevBalanceRef = useRef<string | null>(null);

    useEffect(() => {
        const initialLeftOptions = Array(4).fill(null).map((_, index) => ({
            label: '',
            key: index + 1,
            handleClick: () => { }
        }));
        const initialRightOptions = Array(4).fill(null).map((_, index) => ({
            label: '',
            key: index + 5,
            handleClick: () => { }
        }));

        if (error) {
            const updatedRightOptions = [...initialRightOptions];
            updatedRightOptions[3] = {
                label: 'Enter PIN',
                key: 8,
                handleClick: () => setOverlayOpen(true)
            };
            setLeftOptions(initialLeftOptions);
            setRightOptions(updatedRightOptions);
            setMainMessage("Welcome to the\nATM");
            setSBOpen(true);
        }
        else if (screenType === "welcome") {
            const updatedRightOptions = [...initialRightOptions];
            updatedRightOptions[3] = {
                label: 'Enter PIN',
                key: 8,
                handleClick: () => setOverlayOpen(true)
            };
            setLeftOptions(initialLeftOptions);
            setRightOptions(updatedRightOptions);
            setMainMessage("Welcome to the\nATM");
        }
        else if (screenType === "accountOptions") {
            const updatedLeftOptions = [...initialLeftOptions];
            const updatedRightOptions = [...initialRightOptions];

            updatedLeftOptions[2] = { label: 'Withdraw', key: 3, handleClick: () => handleGoToScreen("withdraw") };
            updatedLeftOptions[3] = { label: 'Deposit', key: 4, handleClick: () => handleGoToScreen("deposit") };
            updatedRightOptions[1] = { label: 'Exit', key: 6, handleClick: () => handleExit() };
            updatedRightOptions[2] = { label: 'Balance', key: 7, handleClick: () => handleBalance() };
            updatedRightOptions[3] = { label: 'Re-enter PIN', key: 8, handleClick: () => setOverlayOpen(true) };

            setLeftOptions(updatedLeftOptions);
            setRightOptions(updatedRightOptions);
            setMainMessage(`Hi ${user?.username}!\nPlease make a choice.`);
        }
        else if (screenType === "balance") {
            const updatedRightOptions = [...initialRightOptions];

            updatedRightOptions[3] = { label: 'Go Back', key: 8, handleClick: () => handleGoToScreen("accountOptions") };

            setLeftOptions(initialLeftOptions);
            setRightOptions(updatedRightOptions);
            setMainMessage(`${user?.username}, your balance for\naccount ${account?.accountNumber}: ${account?.balance}`);
        }
        else if (screenType === "withdraw") {
            const updatedLeftOptions = [...initialLeftOptions];
            const updatedRightOptions = [...initialRightOptions];

            updatedLeftOptions[1] = { label: '$10', key: 2, handleClick: () => handleAmount('withdraw', '10') };
            updatedLeftOptions[2] = { label: '$20', key: 3, handleClick: () => handleAmount('withdraw', '20') };
            updatedLeftOptions[3] = { label: '$50', key: 4, handleClick: () => handleAmount('withdraw', '50') };
            updatedRightOptions[1] = { label: '$100', key: 6, handleClick: () => handleAmount('withdraw', '100') };
            updatedRightOptions[3] = { label: 'Cancel', key: 8, handleClick: () => handleGoToScreen("accountOptions") };

            setLeftOptions(updatedLeftOptions);
            setRightOptions(updatedRightOptions);
            setMainMessage(`${user?.username}!\nSelect amount to withdraw.`);
        }
        else if (screenType === "deposit") {
            const updatedLeftOptions = [...initialLeftOptions];
            const updatedRightOptions = [...initialRightOptions];

            updatedLeftOptions[1] = { label: '$10', key: 2, handleClick: () => handleAmount('deposit', '10') };
            updatedLeftOptions[2] = { label: '$20', key: 3, handleClick: () => handleAmount('deposit', '20') };
            updatedLeftOptions[3] = { label: '$50', key: 4, handleClick: () => handleAmount('deposit', '50') };
            updatedRightOptions[1] = { label: '$100', key: 6, handleClick: () => handleAmount('deposit', '100') };
            updatedRightOptions[3] = { label: 'Cancel', key: 8, handleClick: () => handleGoToScreen("accountOptions") };

            setLeftOptions(updatedLeftOptions);
            setRightOptions(updatedRightOptions);
            setMainMessage(`${user?.username}!\nSelect amount to deposit.`);
        }
    }, [screenType, user, error])

    useEffect(() => {
        if (error !== null) {
            setSBOpen(true);
        }
    }, [error]);

    useEffect(() => {
        if (account) {
            if (prevAccountRef.current === account.accountNumber) {
                if (prevBalanceRef.current !== null && prevBalanceRef.current !== account.balance) {
                    setSBBalanceOpen(true);
                }
            }
            prevBalanceRef.current = account.balance;
            prevAccountRef.current = account.accountNumber;
        }
    }, [account?.accountNumber, account?.balance]);

    return (
        <>
            {
                error !== null && <Snackbar
                    open={sbOpen}
                    autoHideDuration={2000}
                    onClose={() => setSBOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setSBOpen(false)}
                        severity="error"
                    >
                        {`There was an error: ${error}`}
                    </Alert>
                </Snackbar>
            }
            <Snackbar
                open={sbBalanceOpen}
                autoHideDuration={2000}
                onClose={() => setSBBalanceOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSBBalanceOpen(false)}
                    severity="success"
                >
                    Balance updated.
                </Alert>
            </Snackbar>
            <Stack>
                <Box
                    display="flex"
                    flexDirection="column"
                    height="100%"
                    p={2}
                >
                    <Typography sx={{ whiteSpace: 'pre-line' }}>
                        {mainMessage}
                    </Typography>

                </Box>
                <Stack direction="row" sx={{ width: "100%", gap: 2 }} justifyContent={"center"}>
                    <Box key={`left-box`} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1, // Vertical space between stacks
                        width: '100%',
                    }} >
                        {
                            leftOptions.map((item) => (
                                <Stack direction="row" key={`option-${item['key']}`} sx={{ gap: 2 }}>
                                    <Button
                                        onClick={item.handleClick}
                                        key={`left-${item['label']}`}
                                        variant="contained"
                                        sx={{ width: 10, minWidth: 10, maxWidth: 10, height: 30 }}
                                    >
                                    </Button>
                                    <Typography variant="body2">{item['label']}</Typography>
                                </Stack>
                            ))
                        }
                    </Box>
                    <Box key={`right-box`} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1, // Vertical space between stacks
                        width: '100%',
                    }} >
                        {rightOptions.map((item) => (
                            <Stack
                                direction="row" key={`option-${item['key']}`} sx={{ gap: 2 }}
                                justifyContent={'flex-end'} width="100%"
                            >
                                <Typography variant="body2">{item['label']}</Typography>
                                <Button
                                    onClick={item.handleClick}
                                    key={`right-${item['label']}`}
                                    variant="contained"
                                    sx={{ width: 10, minWidth: 10, maxWidth: 10, height: 30 }}
                                >
                                </Button>
                            </Stack>
                        ))}
                    </Box>
                </Stack >
            </Stack >
        </>
    );
}
