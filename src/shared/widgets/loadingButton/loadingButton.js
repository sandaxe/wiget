import React, { Component } from "react";
export default class ButtonLoader extends Component {
  state = {
    loading: false
  };

  fetchData = () => {
    this.setState({ loading: true });
    // eslint-disable-next-line react/prop-types
    this.props.checkout();
    //Faking API call here
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
  };

  render() {
    const { loading } = this.state;

    return (
      <div>
        <button className="loading_button" onClick={this.fetchData} disabled={loading}>
          {loading && (
            <i
              className="fa fa-refresh fa-spin"
              style={{ marginRight: "5px" }}
            />
          )}
          {loading && <span>Placing Order</span>}
          {!loading && <span>PLACE ORDER</span>}
        </button>
      </div>
    );
  }
}
