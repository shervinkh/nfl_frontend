import React from 'react';
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FileSaver from 'file-saver';
import './App.css';

const rushingHeaders = [
  "Player", "Team", "Pos", "Att", "Att/G", "Yds", "Avg",
  "Yds/G", "TD", "Lng", "1st", "1st%", "20+", "40+", "FUM",
];

const sortProps = ["Yds", "Lng", "TD"];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      filter: '',
      sort: 'Sort By ...',
    };
    this.saveCSV = this.saveCSV.bind(this);
  }

  componentDidMount() {
    this.getPlayers();
  }

  getPlayers() {
    fetch(`${process.env.REACT_APP_BACKEND_URI}/api/v1/players`)
      .then(response => response.json())
      .then(data => this.setState({ players: data }))
      .catch((error) => {
        console.error("Error: ", error);
      });
  }

  renderPlayer(player, i) {
    return (
      <tr key={`${i}-${player.Player}`}>
        {rushingHeaders.map(property => (
          <td key={`${i}-${player.Player}-${property}`}>
            {player[property]}
          </td>
        ))}
      </tr>
    );
  }

  getData() {
    let data = this.state.players;
    if (this.state.filter) {
      data = data.filter(player =>
        player.Player.toLowerCase().indexOf(this.state.filter.toLowerCase()) !== -1
      );
    }
    if (this.state.sort !== "Sort By ...") {
      data = data.slice();
      data.sort((a, b) => (
        parseFloat(b[this.state.sort]) - parseFloat(a[this.state.sort])
      ));
    }
    return data;
  }

  saveCSV() {
    const header = rushingHeaders.join(",");
    const lines =
      this.getData()
      .map(player => rushingHeaders.map(prop => player[prop]).join(","));
    const fileContent = [header].concat(lines).join("\n");
    const blob = new Blob([fileContent], {type: "text/csv;charset=utf-8"});
    FileSaver.saveAs(blob, "NFL_Rushing.csv");
  }

  render() {
    return (
      <div className="App">
        <div className="App-container">
          <div className="App-controls">
            <Form.Control
              className="App-search"
              placeholder="Player Name"
              aria-label="Player Name"
              aria-describedby="basic-addon2"
              value={this.state.filter}
              onChange={(e) => this.setState({ filter: e.target.value })}
            />
            <Form.Control
              as="select"
              value={this.state.sort}
              onChange={(e) => this.setState({ sort: e.target.value })}
            >
              {["Sort By ..."].concat(sortProps)
                  .map(prop => <option key={prop}>{prop}</option>)
              }
            </Form.Control>
          </div>
          <Table className="App-Table" striped bordered hover responsive>
            <thead>
              <tr>
                {rushingHeaders.map(name => <th key={name}>{name}</th>)}
              </tr>
            </thead>
            <tbody>
              {this.getData().map(this.renderPlayer.bind(this))}
            </tbody>
          </Table>
          <div className="App-buttons">
            <Button variant="primary" onClick={this.saveCSV}>Download CSV</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
