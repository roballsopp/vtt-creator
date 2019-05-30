import * as React from 'react';
import * as PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import useFileSelector from './use-file-selector.hook';

const useStyles = makeStyles({
	container: {
		display: 'flex',
		backgroundColor: 'black',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

Video.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	captionSrc: PropTypes.string,
	onFileSelected: PropTypes.func.isRequired,
};

Video.defaultProps = {
	width: 600,
	height: 450,
};

export default function Video(props) {
	const { width, height, captionSrc, onFileSelected } = props;
	const [src, setSrc] = React.useState();
	const classes = useStyles();

	const onFilesSelected = React.useCallback(
		e => {
			const [file] = e.target.files;
			const localUrl = URL.createObjectURL(file);
			setSrc(localUrl);
			onFileSelected(file);
		},
		[onFileSelected]
	);

	const openFileSelector = useFileSelector({ accept: 'video/*', onFilesSelected });

	return (
		<div className={classes.container} style={{ width, height }}>
			{!src && (
				<Button variant="contained" color="primary" onClick={openFileSelector}>
					Select Video File
				</Button>
			)}
			{src && (
				<video width={width} height={height} controls>
					<source src={src} />
					<track src={captionSrc} kind="subtitles" srcLang="en" label="English" />
				</video>
			)}
		</div>
	);
}
