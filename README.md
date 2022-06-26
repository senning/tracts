# Setup
These instructions assume you have git and Python installed and all commands should be entered in a terminal.

1. Extract the project from the archive
2. Enter the project `cd tracts`

## Start the backend
 
1. `cd backend`
2. Enter the python virtual environment `. venv/bin/activate` 
3. Run the `sh prod.sh`

_Note_: The frontend requires that the backend is served at `http://localhost:5000`. This is very likely working if you see `Running on http://127.0.0.1:5000` in the terminal.

## Start the frontend
1. Returning to the project root, install dependencies: `yarn` or `npm install`
2. Start the frontend: `yarn start` or `npm run start`
3. The application should launch in your web browser

# Notes
- The details are shown in a view rather than a separate page. This makes it easier to switch to other census tracts and avoided the need for routing. However, the TractDetails component can also be used on a separate page since it only requires the primary key as a prop
- The tract list items include the name of the county encompassing the census tract, and the percentage of area covered by land vs water. This adds a bit of visual interest and helps with distinguishing between tracts given the generic naming scheme while making use only of available data.

# Potential improvements
- The API hostname should be configured in a React environment variable, not hard coded
- Rendering the full list of census tracts causes performance issues and wouldn't scale to a longer list (for example, all census tracts in the US). The backend should return results in smaller pages, and the client should either only show the particular page or should virtualize the list so React only renders a subset of results.
- The layout doesn't elegantly support screens narrower than 800px. One way to handle small screens would be to move the list off-screen when the detail view is shown (like a Drawer in Material UI) with a button to show it
- The map is hard-coded to show the state of Minnesota. It should either be zoomed in on the selected census tract or show the correct state for the census tract, depending on product objectives. 
- TractDetails mixes logic and presentation. Refactoring it into separate container and presentation components makes them easier to reuse, test, and understand. Similarly, the tract list is currently mixed into the main App but should be refactored into a container.
- In React 18 dev mode, useEffects fire twice on load and the cleanup on the first fire currently triggers the request error message. The error message should only show for a fetch error, not an abort