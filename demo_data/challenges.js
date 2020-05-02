module.exports = [
  {
    id: 1,
    pos: { x: 150, y: 150 },
    title: 'Welcome',
    deps: [],
    html: `
      <p>Welcome to the hack-engine! This demo will guide you through the process of creating your own hacking experience (although the engine is not limited to IT usages!).
      </p>
      
      <p>All challenges in this demo will have the same answer, which is "hi". So type "hi" (without quotes) into the input below to continue:
      </p>
    `,
    solution: 'hi',
  },
  {
    id: 2,
    pos: { x: 330, y: 100 },
    title: 'challenges.js file',
    deps: [1],
    html: `
      <p>All data is stored in your data directory. You will pass the path to this directory to the server at startup. To learn how to set up a server, visit the <a href="https://github.com/Entkenntnis/hack-engine">github page</a>.
      </p>
      
      <p>The main file for your challenges is <code>challenges.js</code>. It should export a single array with your challenge definitions. The next tutorial will explain the content of such a definition.
      </p>
      
      <img src="/challenges-file.png">
    `,
    solution: 'hi',
  },
  {
    id: 3,
    pos: { x: 330, y: 200 },
    title: 'config.js file',
    deps: [1],
    html: `
      <p>The server has many configurations, which you can control with the <code>config.js</code> file. Visit the <a href="https://github.com/Entkenntnis/hack-engine">github page</a> to learn which options you can set there.
      </p>
    `,
    solution: 'hi',
  },
  {
    id: 4,
    pos: { x: 330, y: 300 },
    title: 'public folder',
    deps: [1],
    html: `
      <p>You can add static assets into the <code>public</code> folder. They are served at the root of the server. This way, you can add any images, scripts, styles and documents to your challenges, giving you a multitude of possibilities: <a href="/test.mp3">mp3-file example</a>.
      </p>
    `,
    solution: 'hi',
  },
  {
    id: 5,
    pos: { x: 450, y: 170 },
    title: 'challenge definition',
    deps: [2, 3, 4],
    html: `
      <p>This is how the first challenge of this demo looks:
      </p>
      
      <img src="/challenge-definition-basic.png">
      
      <p>Following properties are required for every challenge:</p>
      
      <ul>
        <li><code>id</code>. Every challenge must posess an unique id. It can be any positive integer.</li>
        <li><code>pos</code>. To place the challenge on the map, provide coordinates. The origin is at the top-left corner and the axes go to the right and the bottom. Higher x-coordinate means more right, higher y-coordinate means more to the bottom.</li>
        <li><code>title</code>. The title is shown on the map and as heading in the challenge itself.</li>
        <li><code>deps</code>. The dependency array is a list of ids. If the user solves any challenge with one of these ids, this challenge becomes visible. The first challenge has no dependencies and is immediately visible.</li>
        <li><code>html</code>. The next part the tutorial will take a closer look at the html property.</li>
      </ul>
      
      <p>The simplest way to specify the answer for a challenge is to add the <code>solution</code> property. The solution is compared agains the input <em>ignoring case</em>. There is another more elaborated way to specify the answer, which will be explained on the next page.
      </p>
    `,
    solution: 'hi',
  },
  {
    id: 6,
    pos: { x: 590, y: 110 },
    title: 'html property',
    deps: [5],
    html: `
      <p>The example from the last page was missing the html property. Here is how it looks like:</p>
      
      <p><img src="/demo1.png"></p>
      
      <p>Use html to write the task statements. Any html is allowed, the content is inserted into the page <em>as is</em>. If you take a closer look, you will see that the html is enclosed in backtick quotes. This is a special syntax, which allows multiline strings and which is very convenient for writing larger statements.
      </p>
    `,
    solution: 'hi',
  },
  {
    id: 7,
    pos: { x: 590, y: 220 },
    title: 'dependencies',
    deps: [5],
    html: `
      <p>Here is another example of a challenge with dependencies:</p>
      
      <p><img src="/deps.png"></p>
      
      <p>Dependencies are saying: If you solve on of these challenges, then you are allowed to solve this challenge. This makes it easier to add challenges later on, because you don't need to modify the earlier challenges.
      </p>
    `,
    solution: 'hi',
  },
  {
    id: 8,
    pos: { x: 590, y: 330 },
    title: 'check function I',
    deps: [5],
    html: `
      <p>You can write a custom function to check the answer. To accomplish this, remove the solution property and add the <code>check</code> property with your function instead:
      </p>
      
      <p><img src="/check.png"></p>
      
      <p>
      </p>
    `,
    check: (answer) => {
      const reversed = answer.split('').reverse().join('')
      return {
        answer: reversed,
        correct: reversed === 'hi',
      }
    },
  },
  {
    id: 9,
    pos: { x: 590, y: 440 },
    title: 'check function II',
    deps: [5],
    html:
      '<p>The most simple challenge consists of a text and an input for the answer. The answer of this challenge is <code>hi</code></p>',
    solution: 'hi',
  },
  {
    id: 10,
    pos: { x: 590, y: 550 },
    title: 'hide ui',
    deps: [5],
    html:
      '<p>The most simple challenge consists of a text and an input for the answer. The answer of this challenge is <code>hi</code></p>',
    solution: 'hi',
  },
  {
    id: 11,
    pos: { x: 750, y: 200 },
    title: 'Be creative!',
    deps: [6, 7, 8, 9, 10],
    html:
      '<p>The most simple challenge consists of a text and an input for the answer. The answer of this challenge is <code>hi</code></p>',
    solution: 'hi',
  },
]
