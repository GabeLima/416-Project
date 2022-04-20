import { createTheme } from '@mui/material/styles';
import { borderColor } from '@mui/system';

// all components are set to color
// used to show what is/isn't linked


/* List of color constants */
// original color palette from the minds of DERIT
const color = '#ffa500'
const black = '#000000'
const white = '#FFFFFF'
const test = '#FF0000'

/* Setting template values */
// primary palette
let primary = color;
let secondary = color;
let background = color

// all buttons (except visit on game cards)
let button_background = color;
let button_text = color;

// game cards
let game_card_bg = color;
let tags = color;
let visit_button = color;

// user/player and lobby cards
let card_border = color;
let card_text = color;
let card_bg = color;
let opponent_text = color;

// comments
let comment_bg = color;
let comment_text = color;

// Should this expand to all text?
let result_text = color; // comment section header

// lock icon
let lock_bg = color;
let lock_color = color;


// this can be used as a template and the values are changed above
// doesn't need to be modified unless the general structure is modified
const test_theme = createTheme({
    palette: {
        primary: {
          main: primary,
        },
        secondary: {
          main: secondary,
        },
        background: {
          default: background, // changes the background of every page
        },
    },
    // Comments on result page
    // and one header
    results: {
        text: result_text, // color of the underlined comments header
        comment: {
            bg: comment_bg, // color of the comment box 
            text: comment_text
        }
    },
    // logginScreen and RegisterScreen
    lockIcon: {
        bg: lock_bg,
        color: lock_color
    },
    // user, game, and lobby cards
    card: {
        // other players in lobby/searching profiles
        user: {
            bg: card_bg,
            border: card_border,
            text: card_text,
            opponentText: opponent_text // text color of opponents in lobby
        },
        // live/published game cards
        game: {
            bg: game_card_bg,
            tags: tags,
            button: visit_button
        },
        // displaying game rules in lobby
        lobby: {
            bg: card_bg,
            text: card_text,
            border: card_border,
        },
    },
    // all buttons on the site
    // excluding those on published game cards
    button: {
        bg: button_background,
        text: button_text
    }
});

export default test_theme;