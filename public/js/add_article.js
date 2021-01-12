import EditorJS from '@editorjs/editorjs';
const List = require('@editorjs/list');

const initializeEditor = async function () {

    var editor = new EditorJS({

        tools: {
            header: Header,
        }

    });


    try {
        await editor.isReady;
        console.log('Editor.js is ready to work!')
        /** Do anything you need after editor initialization */



    } catch (reason) {
        console.log(`Editor.js initialization failed because of ${reason}`)
    }
}

initializeEditor();

