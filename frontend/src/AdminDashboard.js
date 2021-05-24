import React, { Fragment } from 'react';

class AdminDashboard extends React.Component {
    
    constructor() {
        super();
        this.state = {
           comics: [],
           title: "",
           info: "",
           poster: null

        };

        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getComics = this.getComics.bind(this);
        this.addComic = this.addComic.bind(this);

    }

    handleFileChange(event) {
        this.setState({ poster: event.target.files[0] });
    }

    handleChange(event, type) {
        const value = event.target.value;
        if(type === "title") {
            this.setState({title: value});
        } else {
            this.setState({info: value});
        }
    }

    async getComics() {
        const response = await (await fetch('http://localhost:3000/comics',{
            method: 'GET',
            credentials: 'include'
        })).json();
        console.log(response);
    }




    async componentDidMount() {
        this.getComics();
    }

    async addComic() {
        console.log(this.state.title);
        console.log(this.state.info);
        let data =  new FormData();
        data.append('title', this.state.title);
        data.append('info', this.state.info);
        data.append('poster', this.state.poster);
        
        const response = await (await fetch('http://localhost:3000/addComic',{    
            method: 'POST',
            credentials: 'include',
            body: data
        })).json();
        console.log(response);
    }


    render() {
        const comicList = this.state.comics.map((comic) => <p>{comic.comicTitle}</p>);
        return (
            <Fragment>
               <div>
                 <h1>Comics</h1>
                 <div>
                    {comicList}
                 </div>
               </div>
               <div>
                  <div>
                    <h1>Add a Comic</h1>
                    <div>
                       Title : <input type="text" value={this.state.title} onChange={(e) => {this.handleChange(e,"title")}}/>
                       <br/>
                       Info : <input type="text"  onChange={(e) => {this.handleChange(e,"info")}} />
                       <br/>
                       Cover : <input type="file" onChange={this.handleFileChange}/>
                       <br/> 
                       <button onClick={this.addComic}>Add</button>
                    </div>
                  </div> 
               </div>
            </Fragment>
        );
    }
}

export default AdminDashboard;