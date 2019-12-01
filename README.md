# โค้ด (@dtinth’s VS Code Fork)

<p align="center">
  <img src="./resources/code-dtinth-fork-logo.svg">
</p>

I had to fork VS Code to implement some features that would not be possible using [VS Code’s Extension API](https://code.visualstudio.com/docs/extensionAPI/overview).

## Added features

- [**Chorded Snippets**](https://github.com/Microsoft/vscode/issues/46487) — This allows me to type words by smashing multiple keys at once. For example, if I define this snippet:

	```js
	"const": {
		"prefix": "nst",
		"chorded": true,
		"body": [
			"const "
		]
	},
	```

	Note the `"chorded": true` directive. Now, if I smashed the <kbd>n</kbd><kbd>s</kbd><kbd>t</kbd> keys simultaneously (order doesn’t matter, but both 3 keys must be pressed at the same time) it will activate the snippet.

- [**Rainbow Strings**](https://medium.com/hacking-atom/rainbow-strings-94a2b99cf8b7) — I prefer strings to be colorful, so in this fork if you set a text color to a magic color, `#fefeff`, then it turns into a rainbow.

	```js
    "editor.tokenColorCustomizations": {
      "strings": "#fefeff"
    },
	```

- **Rotating Cursor** — The cursor rotates when moving up and down. This requires the `editor.cursorSmoothCaretAnimation` setting to be turned on.

## Demo

![Demo](https://i.imgur.com/wxV0gAu.gif)

- Chords: `fun`&rarr;`function$1 () {}`, `con`&rarr;`console.log($1)`, `ret`&rarr;`return`, `fal`&rarr;`false`
- Rainbow strings (`'Hello'`)

![Rotating cursor](https://i.imgur.com/qLHzA09.gif)

## Building

1. Clone this repository.

2. Yarn.

	```
	yarn
	```

3. Build (for macOS).

	```
	yarn gulp vscode-darwin
	```


# Visual Studio Code - Open Source

<!-- [![Build Status](https://dev.azure.com/vscode/VSCode/_apis/build/status/VS%20Code?branchName=master)](https://aka.ms/vscode-builds) -->
[![Build Status](https://dev.azure.com/vscode/VSCode/_apis/build/status/VS%20Code?branchName=master)](https://dev.azure.com/vscode/VSCode/_build/latest?definitionId=12)
[![Feature Requests](https://img.shields.io/github/issues/Microsoft/vscode/feature-request.svg)](https://github.com/Microsoft/vscode/issues?q=is%3Aopen+is%3Aissue+label%3Afeature-request+sort%3Areactions-%2B1-desc)
[![Bugs](https://img.shields.io/github/issues/Microsoft/vscode/bug.svg)](https://github.com/Microsoft/vscode/issues?utf8=✓&q=is%3Aissue+is%3Aopen+label%3Abug)
[![Gitter](https://img.shields.io/badge/chat-on%20gitter-yellow.svg)](https://gitter.im/Microsoft/vscode)

## The Repository

This repository ("`Code - OSS`") is where we (Microsoft) develop the [Visual Studio Code](https://code.visualstudio.com) product. Not only do we work on code and issues here, we also publish our [roadmap](https://github.com/microsoft/vscode/wiki/Roadmap), [monthly iteration plans](https://github.com/microsoft/vscode/wiki/Iteration-Plans), and our [endgame plans](https://github.com/microsoft/vscode/wiki/Running-the-Endgame). This source code is available to everyone under the standard [MIT license](https://github.com/microsoft/vscode/blob/master/LICENSE.txt).

## Visual Studio Code

<p align="center">
  <img alt="VS Code in action" src="https://user-images.githubusercontent.com/1487073/58344409-70473b80-7e0a-11e9-8570-b2efc6f8fa44.png">
</p>

[Visual Studio Code](https://code.visualstudio.com) is a distribution of the `Code - OSS` repository with Microsoft specific customizations released under a traditional [Microsoft product license](https://code.visualstudio.com/License/).

[Visual Studio Code](https://code.visualstudio.com) combines the simplicity of a code editor with what developers need for their core edit-build-debug cycle. It provides comprehensive code editing, navigation, and understanding support along with lightweight debugging, a rich extensibility model, and lightweight integration with existing tools.

Visual Studio Code is updated monthly with new features and bug fixes. You can download it for Windows, macOS, and Linux on [Visual Studio Code's website](https://code.visualstudio.com/Download). To get the latest releases every day, install the [Insiders build](https://code.visualstudio.com/insiders).

## Contributing

There are many ways in which you can participate in the project, for example:

* [Submit bugs and feature requests](https://github.com/microsoft/vscode/issues), and help us verify as they are checked in
* Review [source code changes](https://github.com/microsoft/vscode/pulls)
* Review the [documentation](https://github.com/microsoft/vscode-docs) and make pull requests for anything from typos to new content

If you are interested in fixing issues and contributing directly to the code base,
please see the document [How to Contribute](https://github.com/Microsoft/vscode/wiki/How-to-Contribute), which covers the following:

* [How to build and run from source](https://github.com/Microsoft/vscode/wiki/How-to-Contribute#build-and-run)
* [The development workflow, including debugging and running tests](https://github.com/Microsoft/vscode/wiki/How-to-Contribute#debugging)
* [Coding guidelines](https://github.com/Microsoft/vscode/wiki/Coding-Guidelines)
* [Submitting pull requests](https://github.com/Microsoft/vscode/wiki/How-to-Contribute#pull-requests)
* [Finding an issue to work on](https://github.com/microsoft/vscode/wiki/How-to-Contribute#where-to-contribute)
* [Contributing to translations](https://aka.ms/vscodeloc)

## Feedback

* Ask a question on [Stack Overflow](https://stackoverflow.com/questions/tagged/vscode)
* [Request a new feature](CONTRIBUTING.md)
* Up vote [popular feature requests](https://github.com/Microsoft/vscode/issues?q=is%3Aopen+is%3Aissue+label%3Afeature-request+sort%3Areactions-%2B1-desc)
* [File an issue](https://github.com/Microsoft/vscode/issues)
* Follow [@code](https://twitter.com/code) and let us know what you think!

## Related Projects

Many of the core components and extensions to VS Code live in their own repositories on GitHub. For example, the [node debug adapter](https://github.com/microsoft/vscode-node-debug) and the [mono debug adapter](https://github.com/microsoft/vscode-mono-debug) have their own repositories. For a complete list, please visit the [Related Projects](https://github.com/Microsoft/vscode/wiki/Related-Projects) page on our [wiki](https://github.com/Microsoft/vscode/wiki).

## Bundled Extensions

VS Code includes a set of built-in extensions located in the [extensions](extensions) folder, including grammars and snippets for many languages. Extensions that provide rich language support (code completion, Go to Definition) for a language have the suffix `language-features`. For example, the `json` extension provides coloring for `JSON` and the `json-language-features` provides rich language support for `JSON`.

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## License

Copyright (c) Microsoft Corporation. All rights reserved.

Licensed under the [MIT](LICENSE.txt) license.
