import React from 'react';
import PropTypes from 'prop-types';

const CueTrackContext = React.createContext({
	trackEl: null,
});

CueTrackProvider.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.any,
};

export function CueTrackProvider({ children, className }) {
	const [trackEl, setTrackEl] = React.useState();

	return (
		<CueTrackContext.Provider value={React.useMemo(() => ({ trackEl }), [trackEl])}>
			<div ref={setTrackEl} className={className}>
				{children}
			</div>
		</CueTrackContext.Provider>
	);
}

export function useCueTrack() {
	return React.useContext(CueTrackContext);
}
