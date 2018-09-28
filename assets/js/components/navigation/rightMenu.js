import React from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer'

const rightMenu = ({toggleRightMenu, sideList, rightMenuOpen }) => {
    let style = {
      width: 250
    }
    return (
      <div style={style}>
        <Drawer
          anchor="right"
          open={rightMenuOpen}
          onRequestClose={toggleRightMenu}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={toggleDrawer}
            onKeyDown={toggleRightMenu}
          >
          <div>
            {sideList}
            </div>
          </div>
        </Drawer>
      </div>
  )
}

export default rightMenu