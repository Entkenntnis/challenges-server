module.exports = [
  {
    id : 1,
    pos : { x: 150, y: 150} ,
    title : "Start",
    deps : [],
    html : '<p>This is the first challenge of the demo. The answer is <code>x</code></p>',
    solution : "x"
  },
  {
    id : 2,
    pos : { x: 300, y: 150} ,
    title : "Basic Challenge",
    deps : [1],
    html : '<p>The most simple challenge consists of a text and an input for the answer. The answer of this challenge is <code>hi</code></p>',
    solution : "hi"
  },
  {
    id : 3,
    pos : { x: 300, y: 200} ,
    title : "HTML",
    deps : [1],
    html : `<p>The challenge description may contain any html</p>
      <p><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/%22von_Neumann%22_Architektur_de.svg/320px-%22von_Neumann%22_Architektur_de.svg.png"></p>
      <p>You can images, use lists ... </p>
      <ul>
        <li>Entry 1</li>
        <li>Entry 2</li>
      </ul>
      <p>... and so on</p>
    `,
    solution : "hi"
  },
  {
    id : 4,
    pos : { x: 300, y: 250} ,
    title : "Scripts",
    deps : [1],
    html : `<p>You can also create interactive elements using JavaScript.</p>
      <script>
        setTimeout(() => {
          alert('The answer is hohoho')
        }, 10000)
      </script>
    `,
    solution : "hohoho"
  },
  {
    id : 5,
    pos : { x: 300, y: 300} ,
    title : "Assets",
    deps : [1],
    html : `<p>Place files in the public-folder to make them accessible to the users: <a href="/test.mp3">Beispiel-MP3</a></p>`,
    solution : "hohoho"
  },
  {
    id : 6,
    pos : { x: 300, y: 350} ,
    title : "Server-Side",
    deps : [1],
    html : `<p>You can also process the answer on the server.</p>`,
    check : (raw) => {
      return {answer:raw.toUpperCase(), correct:raw === 'hi'}
    },
  },
  {
    id : 7,
    pos : { x: 400, y: 150} ,
    title : "Basic Challenge 2",
    deps : [2],
    html : '<p>The most simple challenge consists of a text and an input for the answer. The answer of this challenge is <code>hi</code></p>',
    solution : "hi"
  },
  {
    id : 8,
    pos : { x: 500, y: 150} ,
    title : "Basic Challenge 3",
    deps : [3,7],
    html : '<p>The most simple challenge consists of a text and an input for the answer. The answer of this challenge is <code>hi</code></p>',
    solution : "hi"
  },
]
