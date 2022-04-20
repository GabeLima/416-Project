import { createTheme } from '@mui/material/styles';

/* List of color constants */
// original color palette from the minds of DERIT
const light_green = '#a1e887'
const original_green = '#80b192'
const blue_grey = '#4b4e6d'
const white = '#ffffff'
const original_primary = '#6A8D92'
const original_secondary = '#9FB4C7'
const blue_white = '#EEEFFF'

/* Setting template values */
// primary palette
let primary = original_primary;
let secondary = original_secondary;
let background = blue_white;

// all buttons (except visit on game cards)
let button_background = blue_grey;
let button_text = white;

// game cards
let game_card_bg = original_green;
let tags = light_green;
let visit_button = light_green;

// user/player and lobby cards
let card_border = original_green;
let card_text = light_green;
let card_bg = blue_grey;
let opponent_text = blue_white;

// comments
let comment_bg = white;
let comment_text = blue_grey;

// Should this expand to all text?
let result_text = blue_grey; // comment section header

// lock icon
let lock_bg = original_secondary;
let lock_color = white;


// this can be used as a template and the values are changed above
// doesn't need to be modified unless the general structure is modified
const original_theme = createTheme({
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

export default original_theme;