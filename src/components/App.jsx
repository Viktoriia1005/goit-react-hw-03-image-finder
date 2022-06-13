import React, { Component } from 'react';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { animateScroll as scroll } from "react-scroll";
import './App.css'

import api from '../services/api'
import Searchbar from "./Searchbar";
import ImageGallery from "./ImageGallery";
import Modal from "./Modal";
import LoadMore from './Button'
import Loader from './Loader';




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

    if (prevState.searchInfo !== searchInfo ) {
      this.setState({ status: "pending", page: 1 });

      api
        .fetchImages(searchInfo, page)
        .then((data) => data.hits)
        .then((images) => {
          this.setState({ data: images, status: "resolved" });
        })
        .catch((error) => this.setState({ error, status: "rejected" }));
    }

    if (prevState.page !== page && page !== 1) {
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
      scroll.scrollToBottom();
    }
  }

  // handleSubmitForm = (searchInfo) => {
  //   this.setState({ searchInfo, data: [], page: 1 });
  // };

  handleSubmitForm = searchInfo => {
    if (this.state.searchInfo !== searchInfo) {
      this.setState({
        searchInfo: searchInfo,
        page: 1,
      });
    }
    if (this.state.searchInfo === searchInfo) {
      return toast.warning(`You already here "${searchInfo}"`);
    }
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
    scroll.scrollToBottom();
  };

  render() {
    
    const { status, data, currImg } = this.state;
    return (
      <div className="App">
        <Searchbar onSubmit={this.handleSubmitForm} />

        {status === "idle" && <p className='welcomeText'>Please enter your search term</p>}

        {status === "pending" && (
          <Loader />
        )}

        {status === "resolved" && (
          <div className='AppGallery'>
            <ImageGallery data={data} onOpenModal={this.toggleModal} />
            {data.length > 0 && <LoadMore onLoadMore={this.onLoadMore} />}
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
        <ToastContainer autoClose={2000} position="top-right" />

      </div>
    );
  }
}