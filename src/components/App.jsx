import React, { Component } from 'react';
import { ToastContainer } from "react-toastify";
import './App.css'

import api from '../services/api'
import Searchbar from "./Searchbar";
import ImageGallery from "./ImageGallery";
import Modal from "./Modal";
import LoadMore from './Button'




export default class App extends Component {
  static propTypes = {};

  state = {
    searchInfo: "",
    showModal: false,
    data: [],
    error: null,
    status: "idle",
    page: 1,
    currImg: {},
  };

  componentDidUpdate(prevProps, prevState) {
    const { page, searchInfo } = this.state;

    if (prevState.searchInfo !== searchInfo) {
      this.setState({ status: "pending", page: 1 });

      api
        .fetchImages(searchInfo, page)
        .then((data) => data.hits)
        .then((images) => {
          // console.log(images);
          this.setState({ data: images, status: "resolved" });
        })
        .catch((error) => this.setState({ error, status: "rejected" }));
    }

    if (prevState.page !== page) {
      this.setState({ status: "pending" });

      api
        .fetchImages(searchInfo, page)
        .then((data) => data.hits)
        .then((images) =>
          this.setState((prevState) => ({
            data: [...prevState.data, ...images],
            status: "resolved",
          }))
        )
        .catch((error) => this.setState({ error, status: "rejected" }));
      // scroll.scrollToBottom();
    }
  }

  handleSubmitForm = (searchInfo) => {
    this.setState({ searchInfo });
  };

  onLoadMore = () => {
    this.setState((prevState) => ({
      page: prevState.page + 1,
    }));
  };

  toggleModal = (image) => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
      currImg: image,
    }));
  };

  scrollToBottom = () => {
    // scroll.scrollToBottom();
  };

  render() {
    const { status, data, currImg } = this.state;
    return (
      <div className="App">
        <Searchbar onSubmit={this.handleSubmitForm} />

        {status === "idle" && <p className='welcomeText'>Please enter your search term</p>}

        {status === "pending" && (
          <div>
            {/* <Loader
              type="Puff"
              color="#00BFFF"
              height={100}
              width={100}
              timeout={3000} //3 secs
            /> */}
            <ImageGallery data={data} />
          </div>
        )}

        {status === "resolved" && (
          <div>
            <ImageGallery data={data} onOpenModal={this.toggleModal} />
            {data.length > 0 && <LoadMore onLoadMore={this.onLoadMore} />}
            <ToastContainer autoClose={2000} position="top-right" />
          </div>
        )}

        {status === "rejected" && (
          <div>
            <ImageGallery data={data} />
          </div>
        )}

        {this.state.showModal && (
          <Modal onClose={this.toggleModal}>
            <img src={currImg.largeImageURL} alt={currImg.tags} />
          </Modal>
        )}
      </div>
    );
  }
}