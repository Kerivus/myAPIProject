import React, { Component } from 'react';
import './App.css';
import {  BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import GameCard from './GameCard';
import axios from 'axios';
import Popup from 'react-popup';
import './Popup.css';

import {
  Container,
  Row,
  Col,
} from 'reactstrap';

class App extends Component {
  constructor(){
    super();
    this.state = {
      gamelist: [],
      game: [],
      mostviewgame: [],
      redirect: false,
      redirect2: false,
      redirect3: false
    };
  }

  //for popup
  onDismiss() {
    this.setState({ alertVisible: false });
  }

  componentDidMount() {
    this.getAllGames();
  }

  handleSubmit(e) {
    e.preventDefault();
    const query = `/searchgame?name=${this.input.value}`;
    console.log(query);
    axios
      .get(query)
      .then(result => {
        console.log(result);
        if (result.data === 'Not found') {
          Popup.alert('Game Not Found');
        }
        this.setState({gamelist: result.data});
        this.setState({redirect: true});
      })
      .catch(error => {
        alert('Error: ', error);
      });
  }

  viewDetails(id) {
    const query = `/getgame?id=${id}`;
    console.log(query);
    axios
      .get(query)
      .then(result => {
        console.log(result);
        if (result.data === 'Not found') {
          Popup.alert('Game Not Found');
        }
        this.setState({game: result.data});
        this.setState({clicked: id});
        this.setState({redirect2: true});
      })
      .catch(error => {
        alert('Error: ', error);
      });
  }

  getGame(id){
    const query = `/getonegame?id=${id}`;
    console.log(query);
    axios
      .get(query)
      .then(result => {
        console.log(result);
        if (result.data === 'Not found') {
          Popup.alert('Game Not Found');
        }
        this.setState({game: result.data});
      })
      .catch(error => {
        alert('Error: ', error);
      });
  }

  getAllGames(){
    axios
      .get('/getallgames')
      .then(result => {
        this.setState({ mostviewgame: result.data });
        console.log(this.state.mostviewgame);
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <Router>
        <div className="App">
        <Route path="/" exact render={
          () =>{
            const {redirect} = this.state;
            if(redirect){
              return <Redirect to={'/search/'+this.input.value} />;
            }

            return ( 
              <div className="Home">
                <div className="Header">
                <h1>Welcome to Fanbase Game Library!</h1>
                </div>
                <div className="searchBar">
                <form onSubmit={this.handleSubmit.bind(this)}>
                  <label>Enter game title:</label>
                  <input
                  type="text"
                  ref={input => (this.input = input)}
                />
                  <input type="submit" value="Search" />
                </form>
                <Popup />
                </div>
              </div>
              ); 
          }
        }/>

        <Route path="/search/:gameTitle" exact strict render={
          () =>{
            const {redirect2} = this.state;
            if(redirect2){
              return <Redirect to={'/gamedetails/'+this.state.clicked} />;
            }
            var data = this.state.gamelist;
            data = data.reverse();
            console.log(data);

            if (data === undefined || data.length == 0) { 
              return <Redirect to='/' />;
            }
            let gameCards = this.state.gamelist.map(gamelist =>{
                return (
                  <Col sm="1" key={gamelist.id}>
                    <GameCard
                    viewDetails={this.viewDetails.bind(this)}
                    gamelist={gamelist}
                    />
                  </Col>
                );
            }
            );

            return (
              <div>
               <h1>Search Result</h1>
               <Container>
               <Row>
                {gameCards}
              </Row>
              </Container>
              </div>
              ); 
          }
        }/>
        
        <Route path="/gamedetails/:id" exact strict render={
          ()=> {
            var data = this.state.game;
            console.log(data);
            if (data === undefined || data.length == 0) {
              return <Redirect to='/' />;
            }

            return (
              <div>
               <h1 className="gameDH">Game Details</h1>
               <Container>
               <Row>
                 <div className="ContainerDetails">
                 <Col>
                  <img className="gamePoster" src={this.state.game.image} />
                  </Col>
                  <Col>
                  <Row>
                  <span className="GameTitle">Title: <span className="content">{this.state.game.name}</span></span>
                  <p></p>
                  </Row>
                  <Row>
                  <span className="GameDate">Release Date: <span className="content">{this.state.game.release_dates}</span></span>
                  <p></p>
                  </Row>
                  <Row>
                  <span className="GameGenres">Genres: <span className="content">{this.state.game.genres}</span></span>
                  <p></p>
                  </Row>
                  <Row>
                  <span className="GamePlatform">Platforms: <span className="content">{this.state.game.platform}</span></span>
                  <p></p>
                  </Row>
                  <Row>
                  <span className="GameSummary">Summary: <span className="content">{this.state.game.summary}</span></span>
                  </Row>
                  </Col>
                  </div>
              </Row>
              </Container>
              </div>
              ); 
          }
        }/>
        </div>
      </Router>
    );
  }
}

export default App;