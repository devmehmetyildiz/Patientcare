import React, { Component } from "react";
import { DiffEditor } from "@monaco-editor/react";

class MyEditorContainer extends Component {
  editorRef = React.createRef();

  componentDidUpdate(prevProps) {
    if (!prevProps.editorDidMount && this.props.editorDidMount) {
      this.props.editorDidMount(this.editorRef.current);
      setTimeout(() => {
        this.editorRef.current.updateOptions({
          automaticLayout: false,
          readOnly: false,
        });
      }, 0);
    }
  }

  render() {
    return (
      <DiffEditor
        ref={this.editorRef}
        height="60vh"
        defaultLanguage="html"
        defaultValue="// some comment"
      />
    );
  }
}

export default MyEditorContainer;