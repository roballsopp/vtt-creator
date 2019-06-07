import * as React from 'react';
import * as PropTypes from 'prop-types';
import { getVTTFromCues } from '../services/vtt.service';
import { useCues } from '../common';

VttTrack.propTypes = {
	srcLang: PropTypes.string,
	label: PropTypes.string,
};

VttTrack.defaultProps = {
	srcLang: 'en',
	label: 'English',
};

export default function VttTrack({ srcLang, label }) {
	const [captionSrc, setCaptionSrc] = React.useState();

	const { cues } = useCues();

	React.useEffect(() => {
		const vttBlob = getVTTFromCues(cues);
		const vttBlobUrl = URL.createObjectURL(vttBlob);
		setCaptionSrc(vttBlobUrl);
		if (captionSrc) URL.revokeObjectURL(captionSrc);
	}, [captionSrc, cues]);

	return <track src={captionSrc} default kind="subtitles" srcLang={srcLang} label={label} />;
}
