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
		highlightCriteria: [
			{
				date: '2006-02-04',
				color: 'blue', // Highlight Bubbly's birthday in blue
				label: 'Bubbly\'s Birthday'
			},
			{
				start: '2006-02-05',
				end: '2021-05-30',
				color: 'blue',
			},
			{
				start: '2021-08-12',
				end: '2021-08-21',
				color: 'blue',
			}
		],
		timesPerYear: 5

      },
      {
        id: 'family-2',
        name: 'Amma',
		timesPerYear: 5,
		highlightCriteria: [{
				start: '2001-12-14',
				end: '2021-05-30',
				color: 'blue',
			},
			{
				start: '2021-08-12',
				end: '2021-08-21',
				color: 'blue',
			}
		]
      },
      {
        id: 'family-3',
        name: 'Baba',
		timesPerYear: 5,
		highlightCriteria: [
			{
				start: '2001-12-14',
				end: '2021-05-30',
				color: 'blue',
			},
			{
				start: '2021-08-12',
				end: '2021-08-21',
				color: 'blue',
			}
		]
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
		timesPerYear: 3,
		highlightCriteria: [
			{
				start: '2012-08-14',
				end: '2021-01-15',
				color: 'orange'
			},
			{
				start: '2021-08-21',
				end: '2021-12-15',
				color: 'orange',
			},
		]
      },
      {
        id: 'friends-2',
        name: 'Aryan',
		timesPerYear: 4,
		highlightCriteria: [
			{
				start: '2013-08-14',
				end: '2021-05-30',
				color: 'orange'
			},
		]

      },
      {
        id: 'friends-3',
        name: 'Luke',
      },
      {
        id: 'friends-4',
        name: 'Brooke',
		timesPerYear: 3
      },
      {
        id: 'friends-5',
        name: 'Dylan',
		timesPerYear: 3,
		highlightCriteria: [
			{
				start: '2022-06-06',
				end: '2022-08-21',
				color: 'orange',
			},
			{
				start: '2022-12-17',
				end: '2022-12-19',
				color: 'orange',
			},
			{
				start: '2023-01-02',
				end: '2023-01-15',
				color: 'orange',
			},
			{
				date: '2023-03-24',
				color: 'orange',
			},
			{
				start: '2023-06-03',
				end: '2023-06-16',
				color: 'orange',
			},
			{
				start: '2023-07-15',
				end: '2023-07-16',
				color: 'orange',
			},
			{
				start: '2023-11-20',
				end: '2023-11-27',
				color: 'orange',
			},
			{
				start: '2023-12-19',
				end: '2023-12-25',
				color: 'orange',
			},
			{
				start: '2023-12-19',
				end: '2023-12-27',
				color: 'orange',
			},
		]
      },
      {
        id: 'friends-6',
        name: 'Mark',
		timesPerYear: 2
      },
      {
        id: 'friends-7',
        name: 'Praneel',
		timesPerYear: 2,
		highlightCriteria: [
			{
				start: '2023-12-19',
				end: '2023-12-27',
				color: 'orange',
			},
		]
      },
      {
        id: 'friends-8',
        name: 'Parth',
		timesPerYear: 2
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
	highlightCriteria: [
		{
			color: 'green',
			start:
		}
	],
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

const handleToggle = (value) => {
  // Set checked to only the current value, removing all others
  setChecked([value]);
  updateHighlightCriteria([value]); // Update highlight criteria based on new checked state
};

const handleParentToggle = (value, children = []) => {
  // If the current value is already checked, uncheck it
  if (checked.includes(value)) {
    setChecked([]);
    updateHighlightCriteria([]); // Update highlight criteria for no selection
  } else {
    // Check the current value and uncheck all others
    setChecked([value]);
    updateHighlightCriteria([value]); // Update highlight criteria based on new checked state
  }
};

// const handleToggle = (value, childrenIds) => {
//   const currentIndex = checked.indexOf(value);
//   let newChecked = [...checked];

//   if (currentIndex === -1) {
//     newChecked.push(value);
//     // Add all children if any child node is checked
//     if (childrenIds && childrenIds.length) {
//       newChecked = [...newChecked, ...childrenIds.map(child => child.id)];
//     }
//   } else {
//     newChecked.splice(currentIndex, 1);
//     // Remove all children if parent node is unchecked
//     if (childrenIds && childrenIds.length) {
//       newChecked = newChecked.filter((id) => !childrenIds.map(child => child.id).includes(id));
//     }
//   }

//   setChecked(newChecked);
//   updateHighlightCriteria(newChecked); // Update highlight criteria based on new checked state
// };



// 	const handleParentToggle = (value, children = []) => {
//   const currentIndex = checked.indexOf(value);
//   let newChecked = [...checked];
//   const childrenIds = children.map(child => child.id);

//   if (currentIndex === -1) {
//     newChecked.push(value);
//     newChecked = [...newChecked, ...childrenIds];
//   } else {
//     // If unchecking, remove the parent and all its children
//     newChecked = newChecked.filter((id) => id !== value && !childrenIds.includes(id));
//   }

//   setChecked(newChecked);
//   updateHighlightCriteria(newChecked); // Update highlight criteria based on new checked state
// };


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

  const [currentHighlightCriteria, setCurrentHighlightCriteria] = useState([
  {
    date: DateTime.now().toISODate(),
    color: 'red',
    label: 'This Week',
  },

]);

  const updateHighlightCriteria = (newChecked) => {
  if (newChecked.length === 0) {
    setCurrentHighlightCriteria([
      {
        date: DateTime.now().toISODate(),
        color: 'red',
        label: 'This Week',
      },
    ]);
    return;
  }

  let aggregatedCriteria = [];

  const findAndAggregateCriteria = (nodes, checkedIds) => {
    nodes.forEach(node => {
      if (checkedIds.includes(node.id)) {
        if (node.highlightCriteria) {
          aggregatedCriteria = [...aggregatedCriteria, ...node.highlightCriteria];
        }
      }
      if (node.children) {
        findAndAggregateCriteria(node.children, checkedIds);
      }
    });
  };

  findAndAggregateCriteria(treeData, newChecked);

  if (aggregatedCriteria.length === 0) {
    aggregatedCriteria.push({
      date: DateTime.now().toISODate(),
      color: 'red',
      label: 'This Week',
    });
  }

  setCurrentHighlightCriteria(aggregatedCriteria);
};



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

          <LifeTable birthday="2001-12-14" highlightCriteria={currentHighlightCriteria} />
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