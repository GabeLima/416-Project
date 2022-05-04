import { createTheme } from '@mui/material/styles';


// Thanks lov for the color pallete
// a theme will be created to see if this works
const pink = '#e5a4c6'//'#dd6e80'
const green = '#8ab48e'
const purple = '#9667aa'
const blue = '#a4c6e5'
const black = '#000000'
const white = '#FFFFFF'

const white2 = '#E8ECEB'
const orange = '#e28a2b'
const light_blue = '#8CBDB9'
const dark_blue = '#2D3E4E'
const dark_orange = '#d49c69'

// blue-purple
const blue_purple = '#8a2be2'
const eggshell_white = '#F9FEFF'
const tri_blue = '#2b83e2'
const tri_green = '#83e22b'
const grey = '#0000AA'

// primary palette
let primary = blue_purple;
let secondary = tri_blue;
let background = grey;

// all buttons (except visit on game cards)
let button_background = black;
let button_text = white;

// game cards
let game_card_bg = tri_blue;
let tags = tri_green;
let visit_button = tri_green;

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