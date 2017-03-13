import React from 'react';

class Options extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restrictions: [],
      newRestriction: '',
      location: '',
      checked: false,
      locationStr: '',
      seats: 1
    };

    // this.handleNewRestriction = this.handleNewRestriction.bind(this);

    this.handleRestrictionChange = this.handleRestrictionChange.bind(this);
    this.handleRestrictionSubmit = this.handleRestrictionSubmit.bind(this);
    this.configSubmitter = this.configSubmitter.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.getCurrentLocation = this.getCurrentLocation.bind(this);
    this.selectChairs = this.selectChairs.bind(this);
  }

  selectChairs(e){
    let chair = parseInt(e.target.value.split(" ")[0]);
    this.setState({seats: chair});
  }

  handleRestrictionSubmit(e) {
    e.preventDefault();
    var currentRestrictions = this.state.restrictions.slice();
    if (currentRestrictions.indexOf(this.state.newRestriction) === -1) {
      currentRestrictions.push(this.state.newRestriction);
    }
    this.setState({restrictions: currentRestrictions});

  }

  handleRestrictionChange(e) {
    var currentRestrictions = this.state.restrictions.slice();
    console.log('currentRestrictions');
    if (e.target.className === "options") {
      this.state.checked = true;
      currentRestrictions.push(e.target.key);
      this.setState({restrictions: currentRestrictions});
      e.target.className = "options active";

    } else {
      var index = currentRestrictions.indexOf(e.target.name);
      currentRestrictions.splice(index, 1);
      this.setState({restrictions: currentRestrictions});
      e.target.className = "options";

    }
  }

  configSubmitter (e) {
    e.preventDefault();
    var config = {
      restrictions: this.state.restrictions,
      location: this.state.location,
      seats: this.state.seats
    };

    this.props.navigateToResults(e, config);
  }

  handleLocationChange(e) {
    e.preventDefault();
    this.setState({location: e.target.value});

  }



  getCurrentLocation(e) {
    e.preventDefault();
    // this.setState({locationStr: '37.782287, -122.3913078'});
    var location = new Promise(function(resolve, reject) {
      if (!navigator.geolocation) {
        reject(new Error('Not Supported'));
      }

      navigator.geolocation.getCurrentPosition(function(pos) {
        resolve(pos);
      }, function(err) {
        reject(new Error('Permission Denied'));
      });
    });

    location.then(function(pos) {
      this.setState({location: pos.coords, locationStr: pos.coords.latitude.toString() + ', ' + pos.coords.longitude.toString()});
      return;
    }.bind(this)).catch(function(err) {
      console.log(err);
    });

  }

  render() {
    console.log(this.state);
    console.log(this.state.seats,"seats");
    var arr = [];
    for (let i = 1; i < 10; i++) {
      if(i === 1){
        var c = "chair";
      }
      else{
        c = "chairs"
      }
      arr.push(<option className='chair' key={i}>{i} {c}</option>);
    }
    return (
      <div className="options-wrapper">
        <form onSubmit={this.configSubmitter}>
          <div className="location-wrapper">
            <input type="text" placeholder="Location" onChange={this.handleLocationChange} value={this.state.locationStr}/>
            <button onClick={this.getCurrentLocation}><i className="fa fa-map-marker" aria-hidden="true"></i></button>
          </div>
          
            <div onClick={this.handleRestrictionChange} name="keto" className="options">Keto</div>
            <div onClick={this.handleRestrictionChange} name="vegan" className="options">Vegan</div>
            <div onClick={this.handleRestrictionChange} name="vegetarian" className="options">Vegetarian</div>
            <div onClick={this.handleRestrictionChange} name="paleolithic" className="options">Paleo</div>
          
          <select className="chairs" onChange={this.selectChairs}>
            {arr}
          </select>
          <button type="submit" name="restaurants">Search</button>
        </form>
      </div>
    );
  }
}

export default Options;