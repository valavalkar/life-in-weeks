import React, { useState } from 'react';
import Head from 'next/head';
import LifeTable from '../components/LifeTable';
import { DateTime } from 'luxon';
import { Container, Typography, AppBar, Toolbar, Link, CssBaseline, ThemeProvider, createTheme, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Import the menu icon for the button

import {Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import { TreeView, TreeItem } from '@mui/x-tree-view'; // Updated import
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Icons for TreeView
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings'; // Import the settings icon for the button




// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: '#ff1744',
    },
    background: {
      default: '#fff',
    },
  },
});

const treeData = [
  {
    id: 'family',
    name: 'Family',
    children: [
      {
        id: 'family-1',
        name: 'Bubbly',
      },
      {
        id: 'family-2',
        name: 'Amma',
      },
      {
        id: 'family-3',
        name: 'Baba',
      },
    ],
  },
  {
    id: 'friends',
    name: 'Friends',
    children: [
      {
        id: 'friends-1',
        name: 'Arnav',
      },
      {
        id: 'friends-2',
        name: 'Aryan',
      },
      {
        id: 'friends-3',
        name: 'Luke',
      },
      {
        id: 'friends-4',
        name: 'Brooke',
      },
      {
        id: 'friends-5',
        name: 'Dylan',
      },
      {
        id: 'friends-6',
        name: 'Mark',
      },
      {
        id: 'friends-7',
        name: 'Praneel',
      },
      {
        id: 'friends-8',
        name: 'Parth',
      },
    ],
  },
  {
    id: 'education',
    name: 'Education',
    children: [],
  },
  {
    id: 'career',
    name: 'Career',
    children: [],
  },
  {
    id: 'places-lived',
    name: 'Places Lived',
    children: [],
  },
  {
    id: 'travel',
    name: 'Travel',
    children: [],
  },
];








export default function Home() {
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [checked, setChecked] = useState([]);

const handleToggle = (value, childrenIds) => {
  const currentIndex = checked.indexOf(value);
  let newChecked = [...checked];

  if (currentIndex === -1) {
    newChecked.push(value);
    // Add all children if any child node is checked
    if (childrenIds) {
      newChecked = [...newChecked, ...childrenIds];
    }
  } else {
    newChecked.splice(currentIndex, 1);
    // Remove all children if parent node is unchecked
    if (childrenIds) {
      newChecked = newChecked.filter((id) => !childrenIds.includes(id));
    }
  }

  setChecked(newChecked);
};


	const handleParentToggle = (value, children = []) => {
  const allChildrenChecked = children.every(child => checked.includes(child.id));
  const someChildrenChecked = children.some(child => checked.includes(child.id));
  if(allChildrenChecked || someChildrenChecked){
    // If all or some children are checked, uncheck all children and the parent
    handleToggle(value, children);
  } else {
    // If no children are checked, check the parent and all children
    handleToggle(value, children);
  }
};

  const renderTree = (nodes) => (
  <TreeItem key={nodes.id} nodeId={nodes.id} label={
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked.indexOf(nodes.id) !== -1}
            indeterminate={nodes.children && nodes.children.some(child => checked.includes(child.id)) && !nodes.children.every(child => checked.includes(child.id))}
            onChange={(event) => event.target.checked ? handleToggle(nodes.id, nodes.children) : handleParentToggle(nodes.id, nodes.children)}
          />
        }
        label={nodes.name}
      />
    </FormGroup>
  }>
    {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
  </TreeItem>
);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setIsDrawerOpen(open);
  };

  const handleDrawerClick = (event) => {
	// Stop the event from bubbling up to the div with the onClose handler
	event.stopPropagation();
	};

  const highlightCriteria = [
    {
      date: DateTime.now().toISODate(),
      color: 'red', // Highlight the current week in red
    },
  ];

  // Create a theme instance.
  const theme = createTheme({
    palette: {
      primary: {
        main: '#556cd6',
      },
      secondary: {
        main: '#19857b',
      },
      error: {
        main: '#ff1744',
      },
      background: {
        default: '#fff',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Anand's Life in Weeks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <IconButton
		color="inherit"
		aria-label="open settings"
		edge="start"
		onClick={toggleDrawer(true)}
		sx={{ position: 'fixed', bottom: 20, left: 20 }}
		>
		<SettingsIcon />
		</IconButton>


    	<Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
		>
			<div
			role="presentation"
			style={{ width: '250px' }} // Set a fixed width for the drawer content
			>
			<TreeView
				defaultCollapseIcon={<ExpandMoreIcon />}
				defaultExpandIcon={<ChevronRightIcon />}
				multiSelect
				>
				{treeData.map((data) => renderTree(data))}
			</TreeView>

			</div>
		</Drawer>

      <Container maxWidth="lg">
        <main>
          <Typography variant="h2" component="h1" gutterBottom align='center'>
		  	<Link href="https://anandvalavalkar.com" color="inherit" underline="none">
            Anand's Life in Weeks
			</Link>
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom align='center'>
            An experiment in mortality.
          </Typography>

          <LifeTable birthday="2001-12-14" highlightCriteria={highlightCriteria} />
        </main>
      </Container>

      <footer>
        <Container maxWidth="lg">
          <Typography variant="body2" color="textSecondary" align="center">
            *Years have been normalized to 52 weeks (the last week of the year contains the extra 1-2 days)
            <br /><br />
            Inspired by Life In Weeks and the Tail End by WaitButWhy
          </Typography>
        </Container>
      </footer>
    </ThemeProvider>
  );
}