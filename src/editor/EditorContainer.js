import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Loader from '../common/loader.component';
import Editor from './editor.component';

const useStyles = makeStyles(() => ({
	root: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		minHeight: 0,
		minWidth: 0,
	},
}));

export default function EditorContainer() {
	const classes = useStyles();

	const { loading, data } = useQuery(gql`
		query getUser {
			self {
				id
				...EditorUser
			}
		}
		${Editor.fragments.user}
	`);

	if (loading) {
		return (
			<main className={classes.root}>
				<Loader />
			</main>
		);
	}

	const user = data ? data.self : null;

	return <Editor user={user} />;
}
