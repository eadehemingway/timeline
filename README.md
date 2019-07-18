# scales workshop

![](./bars-gif.gif)

This is what we are going to build. clone this repo and open `App.js`. This is where you will write all your code. Take a second to familiarise yourself with the code that exists in the file.

### step one

The first task is to write the x and y scale. you will complete the calculateXScale and calculateYScale functions. You will know you have gotten it right when the console.logs in componentDidMount equal what they say they should equal.

### step two

in componentDidMount draw a static version of the graph, i.e. draw a rectangle for each bit of data determining the height of each bar by the num in the data - use the scales to make sure it all fits correctly!

### step three

the addBar and removeBar buttons currently add/remove an item of data from the data array. Now we need to write the draw function so that this is reflected in the graph. You will need to use the enter and exit methods we learnt in the previous workshop.
once you have done this update the componentdidmount func to remove repeitition.

### step four

add labels for each bar that move when the bars do, this code should follow a very similar pattern to that of the bars.

### to run the app for development

in public

```
npm run build:watch
```

in server

```
npm start
```

go to http://localhost:3000
