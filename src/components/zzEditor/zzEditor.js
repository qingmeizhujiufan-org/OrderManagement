import React from 'react';
import restUrl from 'RestUrl';
import './zzEditor.less';

import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class ZZEditor extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			editorState: EditorState.createEmpty()
		};
	}

	componentWillReceiveProps = (nextProps) => {
		const { editorState } = nextProps;
		if(editorState){
			this.setState({editorState});
		}
	}

    uploadImageCallBack = (file) => {
		console.log('uploadImageCallBack   file === ', file);
		return new Promise(
		    (resolve, reject) => {
		        const xhr = new XMLHttpRequest();
		        xhr.open('POST', restUrl.UPLOAD);
		        const data = new FormData();
	  			data.append('file', file);
		        xhr.send(data);
		      
			    xhr.addEventListener('load', () => {
			        const response = JSON.parse(xhr.responseText);
			        response.data.link = restUrl.BASE_HOST + response.data.link;
			        console.log('response == ', response);
			        resolve(response);
			    });
			    xhr.addEventListener('error', () => {
			        const error = JSON.parse(xhr.responseText);
			        reject(error);
			    });
		    },
		);
	}

	onEditorStateChange = (editorState) => {
		this.setState({
			editorState,
		});

		return this.props.saveEditorState(editorState, this.props.companyId);
	}

    render() {
	  	const { editorState } = this.state;

	    return (
			<Editor
				localization={{ locale: 'zh' }}
				wrapperClassName="wysiwyg-wrapper"
				editorState={editorState}
				onEditorStateChange={this.onEditorStateChange}
				toolbar={{
				    image: {
				    	previewImage: true,
				        uploadCallback: this.uploadImageCallBack,
				        alt: { present: true, mandatory: false },
				    },
				}}
			/>
	    );
	}
}

export default ZZEditor;
