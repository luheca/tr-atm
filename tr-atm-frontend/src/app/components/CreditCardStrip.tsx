import React from 'react';

import { Box } from '@mui/material';

interface creditCardStripProps {
    creditCardType: string | undefined
}

export default function CreditCardStrip({ creditCardType }: creditCardStripProps) {
    // Starting pixel positions in creditcard_sprite for each card type.
    const creditCardIconIndex = {
        'star': 1,
        'pulse': 41,
        'maestro': 82,
        'mastercard': 123,
        'plus': 164,
        'visa': 205
    }

    return (
        <Box sx={{
            position: "relative",
            width: "237px",
            height: "21px",
        }}>
            <img
                src="/atm/creditcard_sprite.png"
                alt="Credit card icons (bottom row)"
                style={{
                    width: "237px",
                    height: "21px",
                    objectFit: "none",
                    objectPosition: "0 -21px"
                }}
            />
            {
                creditCardType &&
                <Box sx={{
                    position: "absolute",
                    left: `${creditCardIconIndex[creditCardType as keyof typeof creditCardIconIndex]}px`,
                    top: "0",
                    width: "40px",
                    height: "21px",
                    overflow: "hidden",
                }}>
                    <img
                        src="/atm/creditcard_sprite.png"
                        alt="Credit card icons (top row section)"
                        style={{
                            width: "auto",
                            height: "42px",
                            objectFit: "none",
                            objectPosition: `-${creditCardIconIndex[creditCardType as keyof typeof creditCardIconIndex]}px 0px`
                        }}
                    />
                </Box>
            }
        </Box>
    );
}