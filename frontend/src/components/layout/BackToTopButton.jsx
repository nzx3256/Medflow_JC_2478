import {
    IconButton,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useEffect } from 'react';
import { useState } from 'react';
import { red } from '@mui/material/colors';

function BackToTopButton() {
    const [visible, setVisible] = useState(false);

    // const handleClick = () => {
    //     window.scroll(0, 0);
    // }

    const toggleVisibility = () => {
        if (document.documentElement.scrollTop > 20) {
            setVisible(true);
        }
        else {
            setVisible(false);
        }
    };

    window.addEventListener("scroll", toggleVisibility);

    return (
        <IconButton
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            sx={{
                position: 'fixed',
                right: '1%',
                bottom: '1%',
                backgroundColor: "primary.light",
                '&:hover': {
                    backgroundColor: "primary.main"
                },
                display: visible ? "inline" : "none",
            }}
        >
            <KeyboardArrowUpIcon fontSize='large'
                sx={{
                    color: 'black',
                }}
            />
        </IconButton>
    );
}

export default BackToTopButton;
