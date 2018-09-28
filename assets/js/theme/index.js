import { createMuiTheme } from 'material-ui/styles'
import lightBlue from 'material-ui/colors/lightBlue'
import red from 'material-ui/colors/red'
import indigo from 'material-ui/colors/indigo'
import blueGrey from 'material-ui/colors/blueGrey'


export const Ciano = {
    '50': '#0094c0',
    '100': '#0094c0',
    '200': '#0094c0',
    '300': '#0094c0',
    '400': '#0094c0',
    '500': '#0094c0',
    '600': '#0094c0',
    '700': '#0094c0',
    '800': '#0094c0',
    '900': '#0094c0',
    'A100': '#0094c0',
    'A200': '#0094c0',
    'A400': '#0094c0',
    'A700': '#0094c0',
  contrastDefaultColor: 'light',
}

export const CianoSecondary = {
    '50': '#0b9899',
    '100': '#0b9899',
    '200': '#0b9899',
    '300': '#0b9899',
    '400': '#0b9899',
    '500': '#0b9899',
    '600': '#0b9899',
    '700': '#0b9899',
    '800': '#0b9899',
    '900': '#0b9899',
    'A100': '#0b9899',
    'A200': '#0b9899',
    'A400': '#0b9899',
    'A700': '#0b9899',
  contrastDefaultColor: 'light',
}

export default createMuiTheme({
  typography: {
    fontFamily:
      'Noto Sans',
    },
  overrides: {
    MuiButton: {
      raised: {
        color: '#fff !important'
      }
    }
  },
  palette: {
    primary: Ciano,
    divider: `1px solid rgba(0, 0, 0, 0.12)`,
    a: '#0094c0',
    centeredColumn: {
      maxWidth: '960px',
    },
    metadata: {
      opacity: '0.6'
    },
    accent: {
      ...CianoSecondary
    },
    type: 'light',
    error: {
      ...CianoSecondary
    }
  }
})
