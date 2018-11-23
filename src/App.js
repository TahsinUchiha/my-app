// import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
// import Search from './Search.js';

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <Search></Search>
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <p>
//             boring text
//           </p>
//           <a
//             className="App-link"
//             href="https://reactjs.org"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Don't Learn React
//           </a>
//         </header>
//       </div>
//     );
//   }
// }

// export default App;

import React, { Component } from 'react';
import axios from 'axios';

import MovieCard from './MovieCard.js';
import Search from './Search.js';

class App extends Component {
    state = {
        movieId: '', 
        title: '',
        movie: {},
        searchResults: [],
        isSearching: false,
    }

    componentDidMount() {
        this.loadMovie()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.movieId !== this.state.movieId) {
            this.loadMovie()
        }
    }

    loadMovie() {
        axios.get(`http://www.omdbapi.com/?apikey=1f4b2007&i=${this.state.movieId}`)
            .then(response => {
                this.setState({ movie: response.data });
            })
            .catch(error => {
                console.log('Sorry, Error', error.message);
            })
    }

    timeout = null;

    searchMovie = (event) => {
        this.setState({ title: event.target.value, isSearching: true  })

        clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
            axios.get(`http://www.omdbapi.com/?apikey=1f4b2007&s=${this.state.title}`)
                .then(response => {

                    if (response.data.Search) {
                        const movies = response.data.Search.slice(0, 5);
                        this.setState({ searchResults: movies });
                    }
                })
                .catch(error => {
                    console.log('Oops!', error.message);
                })
        }, 1000)

        
    }

    // event handler for a search result item that is clicked
    itemClicked = (item) => {
        this.setState(
            {
                movieId: item.imdbID,
                isSearching: false,
                title: item.Title,
            }
        )
    }


    render() {
        return (
            <div onClick={() => this.setState({ isSearching: false })}>
                <Search
                    defaultTitle={this.state.title}
                    search={this.searchMovie}
                    results={this.state.searchResults}
                    clicked={this.itemClicked}
                    searching={this.state.isSearching} />

                <MovieCard movie={this.state.movie} />
            </div>
        );
    }
}

export default App;
