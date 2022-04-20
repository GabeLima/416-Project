import { createTheme } from '@mui/material/styles';


// Thanks lov for the color pallete
// a theme will be created to see if this works
const pink = '#dd6e80'
const green = '#8ab48e'
const purple = '#9667aa'
const blue = '#a4c6e5'
const black = '#000000'
const white = '#FFFFFF'

// primary palette
let primary = blue;
let secondary = pink;
let background = purple;

// all buttons (except visit on game cards)
let button_background = black;
let button_text = white;

// game cards
let game_card_bg = blue;
let tags = pink;
let visit_button = pink;

// user/player and lobby cards
let card_border = green;
let card_text = white;
let card_bg = green;
let opponent_text = purple;

// comments
let comment_bg = white;
let comment_text = black;

// Should this expand to all text?
let result_text = black; // comment section header

// lock icon
let lock_bg = secondary;
let lock_color = white;

// this can be used as a template and the values are changed above
const updated_theme = createTheme({
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

export default updated_theme;