# US Election Data Visualization 🗺️

An interactive web-based visualization tool for exploring US House of Representatives election results (2020-2024) through an interactive state map and detailed district-level analysis.

## Features

- **Interactive US Map**: Click on any state to view detailed election results
- **Year Selection**: Filter results by election year (2020-2024)
- **District-Level Data**: View comprehensive voting data broken down by congressional district
- **Party Color Coding**: Visual distinction between Democratic, Republican, Libertarian, and other party candidates
- **Dynamic Tooltips**: Hover over states to see state names with smooth visual feedback ִֶָ𓂃 ࣪˖ ִֶָ🐇་༘࿐
- **Responsive Data Display**: Results update dynamically based on user selections

## Technical Stack

<!-- ### Frontend
- **HTML5**: Semantic markup structure
- **CSS3**: Custom styling with political party color schemes
- **JavaScript (ES6+)**: Core application logic and data processing -->

### Libraries!!!
- **D3.js (v7.8.5)**: Data visualization and SVG manipulation
- **TopoJSON**: Efficient geographic data handling and rendering

### Data
- CSV format: `House_2020_24.csv` containing election results
- TopoJSON format: `states10m.json` for US state boundaries
- U.S. House 1976–2024 from: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/IG0UN2


<!-- ## Project Structure

```
.
├── index.html              # Main HTML structure
├── scripts/
│   ├── election-data.js    # Data loading and processing module
│   └── map.js             # Map rendering and interaction logic
├── styles/
│   └── all.css            # Application styling
├── House_2020_24.csv      # Election data source
└── states10m.json         # US map geographic data
``` -->

## How It Works

### Data Flow
1. **Data Loading**: CSV election data is loaded asynchronously on page load
2. **Year Population**: Available election years are extracted and populated in the dropdown
3. **State Selection**: Users click on a state in the interactive map
4. **Year Selection**: Users choose an election year from the dropdown
5. **Results Display**: District-level results are filtered, grouped, and rendered in tables

### Key Components

#### Election Data Module (`election-data.js`)
- Loads and parses CSV election data
- Manages state and year selection
- Filters and groups data by congressional district
- Renders election results in tabular format with party color coding

#### Map Module (`map.js`)
- Converts TopoJSON to GeoJSON format for rendering
- Uses Albers USA projection for accurate geographic representation
- Implements interactive hover effects and tooltips
- Handles state selection click events

<!-- ## Usage

1. **Open the Application**: Load `index.html` in a web browser
2. **Select a State**: Click on any state in the map (highlighted in gold when selected)
3. **Choose a Year**: Select an election year from the dropdown menu
4. **View Results**: Explore district-by-district election results with candidate names, parties, vote counts, and percentages -->

<!-- ## Data Structure

The application expects CSV data with the following columns:
- `state`: Two-letter state abbreviation
- `year`: Election year
- `district`: Congressional district number (0 for at-large)
- `candidate`: Candidate name
- `party`: Political party affiliation
- `candidatevotes`: Number of votes received
- `vote_percentage`: Percentage of votes -->

## Disclaimer

This repository contains practice exercises focusing on core functionality only. Version control, code review, and full implementation are not yet complete. Please expect temporary code, incomplete features, and possible inconsistencies.

<!-- ## Browser Compatibility

- Modern browsers with ES6+ support
- Requires JavaScript enabled
- Best viewed on desktop/laptop screens (1200px+ width recommended) -->

## Future Enhancements

- Statistics summary panel
- Additional election years
- Mobile-responsive design
- Data export functionality
- Comparative analysis between years

---

**Author**: Chris  
**Project Type**: Side Project - Data Visualization Practice