import { useState, useEffect, useRef } from "react";
import { Play, RefreshCw, Maximize, Minimize, FileCode } from "lucide-react";
import Editor from "@monaco-editor/react";

const defaultHtml = `<!DOCTYPE html>
<html>
<head>
  <title>StudyHub</title>
</head>
<body>
  <h1>Hello World!</h1>
  <p>Edit your code as you want!</p>
</body>
</html>`;

const defaultCss = `body {
  font-family: Arial, sans-serif;
  padding: 20px;
  text-align: center;
}

h1 {
  color: #4CAF50;
}`;

const defaultJs = `document.querySelector('h1').addEventListener('click', function() {
  alert('You clicked the heading!');
});`;

const CodeEditor = () => {
  const [html, setHtml] = useState(defaultHtml);
  const [css, setCss] = useState(defaultCss);
  const [js, setJs] = useState(defaultJs);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("html");
  const outputRef = useRef(null);
  const editorRefs = useRef({
    html: null,
    css: null,
    js: null,
  });

  const runCode = () => {
    const output = outputRef.current;
    if (!output) return;

    const outputDocument =
      output.contentDocument || output.contentWindow.document;
    outputDocument.open();
    outputDocument.write(`
      ${html}
      <style>${css}</style>
      <script>
        try {
          ${js}
        } catch(e) {
          console.error(e);
        }
      <\/script>
    `);
    outputDocument.close();
  };

  useEffect(() => {
    runCode();
  }, []);

  const handleEditorDidMount = (editor, monaco, language) => {
    editorRefs.current[language] = editor;

    if (language === "html") {
      monaco.languages.registerCompletionItemProvider("html", {
        provideCompletionItems: (model, position) => {
          const suggestions = [
            {
              label: "html",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<html>\n\t$1\n</html>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "HTML root element",
            },
            {
              label: "head",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<head>\n\t$1\n</head>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "HTML head section",
            },
            {
              label: "body",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<body>\n\t$1\n</body>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "HTML body section",
            },
            {
              label: "h1",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<h1>$1</h1>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Heading level 1",
            },
            {
              label: "h2",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<h2>$1</h2>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Heading level 2",
            },
            {
              label: "p",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<p>$1</p>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Paragraph",
            },
            {
              label: "a",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<a href="$1">$2</a>',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Anchor tag",
            },
            {
              label: "img",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<img src="$1" alt="$2">',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Image tag",
            },
            {
              label: "div",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<div>$1</div>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Division container",
            },
            {
              label: "span",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<span>$1</span>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Inline container",
            },
            {
              label: "ul",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<ul>\n\t<li>$1</li>\n</ul>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Unordered list",
            },
            {
              label: "ol",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<ol>\n\t<li>$1</li>\n</ol>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Ordered list",
            },
            {
              label: "li",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<li>$1</li>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "List item",
            },
            {
              label: "br",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<br>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Line break",
            },
            {
              label: "hr",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<hr>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Horizontal rule",
            },
            {
              label: "form",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<form action="$1" method="$2">\n\t$3\n</form>',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Form",
            },
            {
              label: "input",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<input type="$1" name="$2">',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Input field",
            },
            {
              label: "button",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<button>$1</button>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Button",
            },
            {
              label: "label",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<label for="$1">$2</label>',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Label",
            },
            {
              label: "textarea",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText:
                '<textarea name="$1" rows="4" cols="50">$2</textarea>',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Textarea",
            },
            {
              label: "script",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<script>\n\t$1\n</script>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "JavaScript block",
            },
            {
              label: "link",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<link rel="stylesheet" href="$1">',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Link external CSS",
            },
            {
              label: "meta",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<meta name="$1" content="$2">',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Meta tag",
            },
          ];
          return { suggestions };
        },
      });
    }

    // Configure language-specific settings
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES6,
      allowNonTsExtensions: true,
    });

    // Add extra libs for better intellisense
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      `interface HTMLElement {
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
      }`,
      "dom.d.ts"
    );
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      outputRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleReset = () => {
    setHtml(defaultHtml);
    setCss(defaultCss);
    setJs(defaultJs);
  };

  const handleEditorChange = (value, language) => {
    switch (language) {
      case "html":
        setHtml(value);
        break;
      case "css":
        setCss(value);
        break;
      case "javascript":
        setJs(value);
        break;
      default:
        break;
    }
  };

  const renderEditor = () => {
    const options = {
      minimap: { enabled: false },
      fontSize: 14,
      wordWrap: "on",
      automaticLayout: true,
      scrollBeyondLastLine: false,
      theme: "vs-dark",
    };

    switch (activeTab) {
      case "html":
        return (
          <Editor
            height="100%"
            defaultLanguage="html"
            language="html"
            value={html}
            onChange={(value) => handleEditorChange(value, "html")}
            onMount={(editor, monaco) =>
              handleEditorDidMount(editor, monaco, "html")
            }
            options={options}
          />
        );
      case "css":
        return (
          <Editor
            height="100%"
            defaultLanguage="css"
            language="css"
            value={css}
            onChange={(value) => handleEditorChange(value, "css")}
            onMount={(editor, monaco) =>
              handleEditorDidMount(editor, monaco, "css")
            }
            options={options}
          />
        );
      case "js":
        return (
          <Editor
            height="100%"
            defaultLanguage="javascript"
            language="javascript"
            value={js}
            onChange={(value) => handleEditorChange(value, "javascript")}
            onMount={(editor, monaco) =>
              handleEditorDidMount(editor, monaco, "js")
            }
            options={options}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-indigo-700">
        <FileCode className="w-6 h-6 text-indigo-600" />
        Advanced Code Editor
      </h1>

      <div
        className={`bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300 ${
          isFullscreen ? "fixed inset-0 z-50 m-0" : ""
        }`}
      >
        <div className="flex flex-col md:flex-row h-[70vh]">
          {/* Editor Panel */}
          <div className="w-full md:w-1/2 flex flex-col border-r border-gray-300">
            {/* Tabs */}
            <div className="flex bg-gradient-to-r from-indigo-100 to-blue-100 border-b border-gray-300">
              {["html", "css", "js"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? "text-white bg-indigo-600 border-b-2 border-indigo-800"
                      : "text-gray-700 hover:text-indigo-700 hover:bg-indigo-50"
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-hidden">{renderEditor()}</div>

            {/* Controls */}
            <div className="bg-gradient-to-r from-indigo-100 to-blue-100 px-4 py-2 flex justify-between items-center border-t border-gray-300">
              <div className="flex space-x-2">
                <button
                  onClick={runCode}
                  className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition shadow-sm"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Run
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center px-3 py-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition shadow-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex items-center justify-between bg-gradient-to-r from-indigo-100 to-blue-100 px-4 py-2 border-b border-gray-300">
              <span className="font-medium text-gray-800">Live Preview</span>
              <button
                onClick={handleFullscreen}
                className="text-indigo-700 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-200 transition"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </button>
            </div>
            <iframe
              ref={outputRef}
              className="flex-1 w-full border-0 bg-white"
              title="Output Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
