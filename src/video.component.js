import * as React from 'react';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import FileSelector from './file-selector.component';

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
	const { width, height, captionSrc } = props;
	const [src, setSrc] = React.useState();
	const classes = useStyles();

	const onFileSelected = file => {
		const localUrl = URL.createObjectURL(file);
		setSrc(localUrl);
		props.onFileSelected(file);
	};

	return (
		<div className={classes.container} style={{ width, height }}>
			{!src && <FileSelector label="Select Video File" accept="video/*" onFileSelected={onFileSelected} />}
			{src && (
				<video width={width} height={height} controls>
					<source src={src} />
					<track src={captionSrc} kind="subtitles" srcLang="en" label="English" />
				</video>
			)}
		</div>
	);
}
