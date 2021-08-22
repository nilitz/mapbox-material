import React, { useRef, useEffect, useState} from 'react';
import {
    AppBar,
    createStyles,
    CssBaseline, Divider, Drawer,
    IconButton, List, ListItem, ListItemIcon, ListItemText,
    makeStyles,
    Theme,
    Toolbar,
    Typography,
    useTheme
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExploreIcon from '@material-ui/icons/Explore';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import clsx from 'clsx';
import '../../styles/nav.css'

import MapboxComponent from "../map/MapboxComponent";


// @ts-ignore
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom"



const drawerWidth = 350;
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            backgroundColor: 'cornflowerblue',
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
    }),
);
function NavComponent() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Mapbox & MaterialUI
                    </Typography>
                </Toolbar>
            </AppBar>
            <Router>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                        <List>
                            <Link to="/">
                                <ListItem button key={"Home"}>
                                    <ListItemIcon><RadioButtonUncheckedIcon /></ListItemIcon>
                                    <ListItemText primary={"Home"} />
                                </ListItem>
                            </Link>


                            <Link to="/maps">
                                <ListItem button key={"Maps"}>
                                    <ListItemIcon><ExploreIcon /></ListItemIcon>
                                    <ListItemText primary={"Maps"} />
                                </ListItem>
                            </Link>
                        </List>
                </Drawer>
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <div className={classes.drawerHeader} />

                        <Switch>
                            <Route exact path="/">
                                1
                            </Route>
                            <Route path="/maps">
                                <MapboxComponent />
                            </Route>
                        </Switch>



                </main>
            </Router>
        </div>
    );
}

export default NavComponent;
