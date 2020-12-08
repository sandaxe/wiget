import React, { Component } from "react";
import { findDOMNode } from 'react-dom';
import PropTypes from "prop-types";
import debounce from 'lodash/debounce';
import identity from 'lodash/identity';
import find from 'lodash/find';
import classSet from 'react-classset';
import Icon from '../icon';
import { RelativePortal } from "../../components/portal";
import { StoreProvider } from '../../store.provider';
import { CheckBox } from '../checkbox';

import styles from "./multi.select.css";

const KEYS = {
  DOWN_ARROW: 40,
  UP_ARROW: 38,
  ENTER: 13,
  BACKSPACE: 8,
  ESCAPE: 27,
  TAB: 9,
  SHIFT: 16
};

function Chip(props) {
  const stopProppagation = evt => {
    evt.stopPropagation();
  };
  return (
    <div data-type="multi-chip" className={styles.chip} onClick={stopProppagation}>
      <p className={styles.text}>{props.value}</p>
    </div>
  );
}

Chip.defaultProps = {
  onClose: () => {}
};

Chip.propTypes = {
  value: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  onClose: PropTypes.func
};

export class MultiSelect extends Component {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.oneOfType(PropTypes.string, PropTypes.object)),
    selectedOptions: PropTypes.arrayOf(PropTypes.oneOfType(PropTypes.string, PropTypes.object)),
    label: PropTypes.string,
    uniqueKey: PropTypes.string,
    value: PropTypes.oneOfType(PropTypes.string, PropTypes.object), // for single selected value
    onSelect: PropTypes.func,
    onRemove: PropTypes.func,
    autoFocus: PropTypes.bool,
    onUpdate: PropTypes.func,
    onFilter: PropTypes.func,
    onClose: PropTypes.func,
    optionComponent: PropTypes.func, // custom option component
    chipComponent: PropTypes.func, // custom chip for select
    placeholder: PropTypes.string,
    multi: PropTypes.bool,
    searchable: PropTypes.bool,
    inlineSearch: PropTypes.bool,
    onlyOptions: PropTypes.bool, //show only option drop-down for some special cases drop-down
    clearable: PropTypes.bool,
    loadData: PropTypes.func,
    createNewLabel: PropTypes.string,
    createNewCallback: PropTypes.func,
    readOnly: PropTypes.bool,
    type: PropTypes.string, // small and textOnly select box
    style: PropTypes.object,
    optionListClass: PropTypes.string,
    //portal props
    usePortal: PropTypes.bool,
    portalProps: PropTypes.object
  };

  static defaultProps = {
    options: [],
    selectedOptions: [],
    onFilter: () => [],
    onSelect: () => { },
    onRemove: () => { },
    onUpdate: () => { },
    onClose: () => { },
    createNewCallback: () => { },
    label: 'name',
    searchable: true,
    inlineSearch: false,
    multi: false,
    onlyOptions: false,
    clearable: true,
    className: '',
    readOnly: false,
    style: {},
    usePortal: true,
    portalProps: {
      top: 1,
      left: 0
    }
  };

  constructor(props) {
    super(props);
    let [label, key] = this.props.label.split(" as ");
    this.id = Math.round(Math.random() * 10000);
    this.state = {
      displayKey: label,
      valueKey: key,
      isOpen: this.props.onlyOptions,
      options: this.props.options,
      selectedOptions: this.props.selectedOptions, // for multi-select
      selectedOption: this.props.value, // for single-select
      isOptionAnObject: typeof this.props.options[0] === "object"
    };

    this.searchBoxRef = React.createRef();
    this.dropDownManager = StoreProvider.createStore('selectBox', {});

    this.portalClassName = `dropdownPortal-${Math.round(Math.random() * 100000)}`;
    this.debouncedFilterOption = debounce(this.filterOptions.bind(this), 300);
    this.clearOption = this.clearOption.bind(this);
    this.selectOption = this.selectOption.bind(this);
    this.openList = this.openList.bind(this);
    this.closeList = this.closeList.bind(this);
    this._windowClick = this._windowClick.bind(this);

    this.DropdownWrapper = this.props.usePortal ? RelativePortal : (prop) => <div {...prop} />;
    this.dropdownManagerCallback = this.dropdownManagerCallback.bind(this);
  }

  componentDidMount() {
    this.dropDownManager.observe('active', this.dropdownManagerCallback);

    document.addEventListener('click', this._windowClick);
    document.addEventListener('keydown', this.keyNavigationHandler);
    //document.addEventListener('mousewheel', this.rePositionDropdownDirection);
    this.selectBoxWidth = document.querySelector(`.multiSelect-${this.id}`).offsetWidth;
    if(this.props.autoFocus) {
      this.openList();
    }else {
      this.setState({});
    }
  }

  componentWillReceiveProps(newProps) {
    //set updated selected value for single select
    if (!this.props.multi && newProps.value !== this.state.selectedOption) {
      //if the value is string while option is object, then change value to object with given label value
      if(typeof newProps.value === 'string' && this.state.isOptionAnObject && !this.state.valueKey) {
        this.setState({ selectedOption: { [this.state.displayKey]: newProps.value } });
      }else {
        this.setState({ selectedOption: newProps.value });
      }
    }

    // set updated selected value for multi select
    if(this.props.multi) {
      this.setState({ selectedOptions: newProps.selectedOptions });
    }

    if(newProps.options) {
      let isOptionAnObject = typeof newProps.options[0] !== 'string';
      this.setState({ options: newProps.options, isOptionAnObject });
    }

    //for grid
    if(!this.state.isOpen && newProps.autoFocus) {
      this.openList();
    }
  }

  componentDidUpdate() {
    if(this.state.isOpen) {
      this.setOpeningDirection();
      this.searchBoxRef.current && this.searchBoxRef.current.focus();
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationFrameId);
    this.dropDownManager.destroy('active', this.dropdownManagerCallback);

    document.removeEventListener('click', this._windowClick);
    document.removeEventListener('keydown', this.keyNavigationHandler);
    //document.removeEventListener('mousewheel', this.rePositionDropdownDirection);
  }

  dropdownManagerCallback(activeDropdown) {
    if(activeDropdown !== this) {
      //there should be only one dropdown can be opened across the app
      this.closeList();
    }
  }

  rePositionDropdownDirection = () => {
    this.portalTopPos = null;
    requestAnimationFrame(() => this.setOpeningDirection());
  }

  setOpeningDirection() {
    if(this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.animationFrameId = requestAnimationFrame(() => {
      if(this.state.isOpen) {
        let node = findDOMNode(this);
        let dropdownPortal = document.querySelector(`.${this.portalClassName}`);
        //let portalPos = dropdownPortal.getBoundingClientRect();
        //keep the initial position, to place the dropdown correctly when doing filter
        this.portalTopPos = this.portalTopPos ? this.portalTopPos :
          parseInt(dropdownPortal.style.top.replace('px', ''), 0);
        let bodyHeight = document.querySelector('body').offsetHeight;
        let dropdownHeight = document.querySelector(`.${styles.optionContainer}`).offsetHeight;
        let selectBoxHeight = node.querySelector(`.${styles.selectBox}`) ?
          node.querySelector(`.${styles.selectBox}`).offsetHeight : 0;
        if((this.portalTopPos + dropdownHeight + selectBoxHeight) > bodyHeight) {
          this.openDirection = 'top';
        }
        if(this.openDirection === 'top') {
          //dropdownPortal.style.top = `${this.portalTopPos - (dropdownHeight + selectBoxHeight) }px`;
          let dropdownTop = node.getBoundingClientRect().top;
          dropdownPortal.style.top = `${Math.max(dropdownTop - dropdownHeight, 0) }px`;
        }
      }else{
        this.openDirection = 'down';
        this.portalTopPos = null;
      }
    });
  }

  keyNavigationHandler = (evt) => {
    if(!this.state.isOpen &&
      [KEYS.DOWN_ARROW, KEYS.ENTER].includes(evt.which)) {
      //opens the menu via keyboard when it is focused
      let node = findDOMNode(this);
      if(node.contains(evt.target) || node === evt.target) {
        this.openList();
        return;
      }
    }
    //skip when key nav select option is not opened
    if(!this.state.isOpen) return;

    let optionElems = Array.from(document.querySelectorAll(`.${styles.optionList} > li`));

    if(optionElems.length === 0) return;

    let selectedElem = document.querySelector(`.${styles.optionList} > li.${styles.active}`);
    let selectedElemIndex = 0;

    const toggleActiveElem = (elem) => {
      elem.classList.toggle(styles.active);
    };

    const getNexElem = (index) => {
      if(index === (optionElems.length - 1)) {
        return optionElems[0];
      }
      return optionElems[index + 1];
    };

    const getPrevElem = (index) => {
      if(index === 0) {
        return optionElems[optionElems.length - 1];
      }
      return optionElems[index - 1];
    };

    const handleUpArrow = () => {
      toggleActiveElem(selectedElem);
      let prevElem = getPrevElem(selectedElemIndex);
      toggleActiveElem(prevElem);
      prevElem.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    const handleDownArrow = () => {
      toggleActiveElem(selectedElem);
      let nextElem = getNexElem(selectedElemIndex);
      toggleActiveElem(nextElem);
      nextElem.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    const handleEnter = (evt) => {
      if(selectedElem.classList.contains(styles.createNew)) {
        this.props.createNewCallback();
        return;
      }
      this.selectOption(evt, this.state.options[selectedElemIndex]);
    };

    if(!selectedElem) {
      selectedElem = optionElems[0];
      toggleActiveElem(selectedElem);
    }
    selectedElemIndex = optionElems.indexOf(selectedElem);

    switch(evt.which) {
    case KEYS.UP_ARROW:
      evt.preventDefault();
      handleUpArrow();
      break;
    case KEYS.DOWN_ARROW:
      evt.preventDefault();
      handleDownArrow();
      break;
    case KEYS.ENTER:
      handleEnter();
      break;
    case KEYS.ESCAPE:
      this.closeList();
      break;
    default:
      return;
    }
  }

  _windowClick(evt) {
    let container = findDOMNode(this);
    let dropdownList = document.querySelector(`.${styles.optionContainer}`);
    if (container.contains(evt.target) || (dropdownList && dropdownList.contains(evt.target))) {
      return;
    }
    if(this.state.isOpen) {
      this.closeList();
    }
  }

  clearSingleSelect(option) {
    if (option && this.state.isOptionAnObject && this.state.valueKey) {
      option = option[this.state.valueKey];
    }
    this.props.onRemove(option);
  }

  clearMultiSelect(option) {
    let index = this.isAlreadySelected(option);

    if (index === -1) return;

    this.setState(prevState => {
      return {
        selectedOptions: [
          ...prevState.selectedOptions.slice(0, index),
          ...prevState.selectedOptions.slice(
            index + 1,
            prevState.selectedOptions.length
          )
        ]
      };
    }, () => {
      this.props.onUpdate(this.state.selectedOptions);
    });
    if (this.state.isOptionAnObject && this.state.valueKey) {
      option = option[this.state.valueKey];
    }
    this.props.onRemove(option);
  }

  clearOption(option = null) {
    this.props.multi ? this.clearMultiSelect(option) : this.clearSingleSelect(option);
  }

  singleSelect(option, e) {
    if(this.isAlreadySelected(option) !== -1) return;
    let value = option;
    if (this.state.isOptionAnObject && this.state.valueKey) {
      value = option[this.state.valueKey];
    }
    this.setState({ selectedOption: value });
    this.props.onSelect(value, e);
    this.closeList();
  }

  multiSelect(option, e) {
    this.props.onSelect(option, e);
    if (this.state.isOptionAnObject) {
      let valueKey = this.state.valueKey || this.state.displayKey;
      //remove the duplicate
      if (this.isAlreadySelected(option) !== -1) {
        this.clearOption(option);
        return;
      }
      this.setState(prevState => {
        return {
          selectedOptions: [
            ...prevState.selectedOptions,
            this.state.valueKey ? option[valueKey] : option
          ]
        };
      }, () => {
        this.props.onUpdate(this.state.selectedOptions);
      });
    } else {
      //remove the duplicate
      if (this.isAlreadySelected(option) !== -1) {
        this.clearOption(option);
        return;
      }
      this.setState(prevState => {
        return { selectedOptions: [...prevState.selectedOptions, option] };
      }, () => {
        this.props.onUpdate(this.state.selectedOptions);
      });
    }
  }

  selectOption(e, option) {
    //close search box once option is selected
    !this.props.multi && setTimeout(() => this.blurSelectBoxFocus(), 0);
    this.props.multi ? this.multiSelect(option, e) : this.singleSelect(option, e);
  }

  openList(evt) {
    console.log('open list calling');
    if(this.props.readOnly)return;

    if(this.state.isOpen) return this.closeList();

    if(this.props.options && this.props.options.length === 0 && this.props.loadData) {
      this.setState({ isLoading: true });
      this.props.loadData()
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }

    if(this.searchBoxRef.current) {
      this.searchBoxRef.current.focus();
    }

    //set active dropdown, this will close all opened dropdown
    this.dropDownManager.update('active', this);

    this.setState({ isOpen: true }, this.setOpeningDirection);
  }

  closeList() {
    this.setState({ isOpen: false, options: this.props.options });
    let value = this.props.multi ? this.state.selectedOptions : '';
    //this.props.onUpdate(value);
    this.props.onClose(value);
  }

  filterOptions(filterText) {
    let filteredOption = this.props.onFilter(filterText);
    if (filteredOption && filteredOption.then) {
      filteredOption.then(
        options => {
          if(options) {
            this.setState({ options });
          }
        },
        err => {
          this.setState({});
        }
      );
    } else if (this.state.isOptionAnObject) {
      let valueKey = this.state.displayKey;
      this.setState(() => ({
        options: this.props.options.filter(item => {
          return item[valueKey] && item[valueKey].trim().toLowerCase().indexOf(filterText.trim().toLowerCase()) !== -1;
        })
      }));
    } else {
      this.setState(() => ({
        options: this.props.options.filter(item => {
          return item.trim().toLowerCase().indexOf(filterText.trim().toLowerCase()) !== -1;
        })
      }));
    }
  }

  isAlreadySelected(option) {
    let index = -1;
    if (this.state.isOptionAnObject) {
      let valueKey = this.state.valueKey || this.state.displayKey;
      if(this.state.valueKey) {
        index = this.state.selectedOptions.indexOf(option[valueKey]);
      }else {
        index = this.state.selectedOptions.findIndex(item => {
          return item[valueKey] === option[valueKey];
        });
      }
    } else {
      index = this.state.selectedOptions.indexOf(option);
    }
    return index;
  }

  focusSelectBoxFocus = () => {
    this.setState({
      isFocused: true
    });
  }

  blurSelectBoxFocus = () => {
    this.setState({
      isFocused: false
    });
  }

  filterSearch = (evt) => {
    if(this.props.multi && evt.which === KEYS.BACKSPACE && !evt.target.value) {
      let lastOption = this.state.selectedOptions[this.state.selectedOptions.length - 1];
      if(this.state.valueKey) {
        lastOption = this.props.options.find(option => option[this.state.valueKey] === lastOption);
      }
      lastOption && this.clearOption(lastOption);
      //return; // will fill un-neccersorily when deleting the seleted option; #TODO
    }
    if(evt.which === KEYS.TAB) {
      requestAnimationFrame(() => {
        this.closeList();
        this.blurSelectBoxFocus();
      });
      return;
    }
    evt.persist();
    this.debouncedFilterOption(evt.target.value);
  }

  preventBubbling(evt) {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const showMultiSelect = () => {
      let selectedOptions = this.state.selectedOptions;
      //selected options are string while list of options are object with 'Name as Value' keyword is present
      if(this.state.isOptionAnObject && this.state.selectedOptions.length > 0 && this.state.valueKey) {
        // cache the result to avoid multiple loopings == TODO
        selectedOptions = this.state.selectedOptions.map((option) => {
          return find(this.props.options, { [this.state.valueKey]: option });
        }).map(identity);
      }
      return (
        <div className={styles.selectedOptions} data-type="multi-select">
          {
            selectedOptions.map(option => {
              // let value = this.state.isOptionAnObject ?
              //   option[this.state.displayKey] :
              //   option;
              let value;
              if(typeof option === "object") {
                value = option[this.state.displayKey];
              }else{
                value = option;
              }
              let ChipComp = this.props.chipComponent || Chip;
              return (
                <ChipComp
                  key={value}
                  readOnly={this.props.readOnly}
                  value={value}
                  option={option}
                  onClose={evt => {
                    evt.preventDefault();
                    this.clearOption(option);
                  }}
                />
              );
            })
          }
          {
            this.props.searchable && this.state.isOpen && !this.props.readOnly &&
            <input className={styles.searchBox}
              ref={this.searchBoxRef}
              type="text"
              autoFocus={this.props.autoFocus}
              key={selectedOptions.length}
              onKeyUp={this.filterSearch}/>
          }
        </div>
      );
    };

    const showSingleSelect = () => {
      let value = '';
      let isOptionAnObject = typeof this.state.selectedOption === "object";
      if(this.state.selectedOption && this.state.isOptionAnObject && this.state.valueKey) {
        //when "label as value" is set find the display value for give value
        let selectedOption = find(this.props.options, { [this.state.valueKey]: this.state.selectedOption });
        value = selectedOption ? selectedOption[this.state.displayKey] : '';
      }else if(this.state.selectedOption && isOptionAnObject) {
        value = this.state.selectedOption[this.state.displayKey];
      }else {
        value = this.state.selectedOption;
      }
      return (
        <div className={styles.singleSelect} data-type="single-select">
          {
            value ?
              <React.Fragment>
                {
                  this.props.chipComponent ?
                    <this.props.chipComponent option={this.state.selectedOption}/> :
                    <span className={styles.truncate} title={value}>{value}</span>
                }
                {
                  this.props.clearable ?
                    <span className={styles.closeIcon} onClick={(evt) => {evt.stopPropagation(); this.clearOption(); }}>
                      X
                    </span> : null
                }
              </React.Fragment> :
              <span className={`${styles.truncate} ${styles.placeholder}`}>{value || this.props.placeholder}</span>
          }
          {
            //this.props.autoFocus
            this.props.searchable && this.state.isOpen && !this.props.readOnly &&
            <input type="text"
              autoFocus={true}
              placeholder={value || this.props.placeholder}
              key={value}
              className={styles.searchBox}
              //onFocus={this.openList}
              onKeyUp={this.filterSearch}/>
          }
        </div>
      );
    };

    let className = classSet({
      [styles.multiSelect]: styles.multiSelect,
      [styles.multi]: this.props.multi,
      [this.props.className]: this.props.className,
      [styles.disabled]: this.props.readOnly,
      [styles[this.props.type]]: this.props.type
    });

    return (
      <div className={`${className} multiSelect-${this.id}`}
        style={this.props.style}
        onClick={(evt) => { this.preventBubbling(evt); this.openList();}}
        onFocus={this.focusSelectBoxFocus} onBlur={this.blurSelectBoxFocus}
        tabIndex={this.props.readOnly ? -1 : 0}>
        {
          !this.props.onlyOptions &&
          <div className={styles.selectBox} data-type="select-box">
            {
              this.props.multi ? showMultiSelect() : showSingleSelect()
            }
            <div className={styles.caret} data-type="select-icon">
              <Icon name={'Arrow'} size={12}/>
            </div>
          </div>
        }
        {this.state.isOpen && (<this.DropdownWrapper {...this.props.portalProps} className={this.portalClassName}>
          <div data-type="portal-list"
            className={styles.optionContainer}
            style={{ minWidth: `${this.selectBoxWidth}px` }}
            onClick={this.preventBubbling}>
            {this.props.inlineSearch && (
              <div className={styles.inlineSearchBox}>
                <input placeholder="Search here..."
                  autoFocus={true}
                  onChange={(evt) => { evt.persist(); this.debouncedFilterOption(evt.target.value); }} />
                searchicon
              </div>
            )}
            <ul className={`${this.props.optionListClass} ${styles.optionList}`}>
              { !this.state.isLoading && this.state.options &&
                  this.state.options.map((option, index) => {
                    let value = this.state.isOptionAnObject ?
                      option[this.state.displayKey] :
                      option;
                    //let key = this.state.isOptionAnObject ?
                    //option[this.props.uniqueKey || this.state.displayKey] : option;
                    let selectedClassName = option === this.state.selectedOption ? styles.active : '';
                    let OptionComponent = this.props.optionComponent;

                    if(OptionComponent) {
                      return (<li key={index} className={`${styles.option} ${selectedClassName}`}
                        onClick={(e) => this.selectOption(e, option)}>
                        <OptionComponent onClick={(e) => {}}
                          option={option} isSelected={this.isAlreadySelected(option) !== -1} />
                      </li>);
                    }else if(this.props.multi) {
                      return (
                        <li key={index} className={styles.option}>
                          <CheckBox className={`${selectedClassName} ${styles.checkbox}`}
                            filled={true} label={value}
                            onClick={(e) => this.selectOption(e, option)}
                            value={this.isAlreadySelected(option) !== -1} />
                        </li>
                      );
                    }else {
                      return (
                        <li key={index} className={`${styles.option} ${selectedClassName}`}
                          onClick={(e) => this.selectOption(e, option)}>
                          <p>{value}</p>
                        </li>
                      );
                    }
                    // return (
                    //   <li key={index} className={`${styles.option} ${selectedClassName}`}
                    //     onClick={(e) => this.selectOption(e, option)}>
                    //     {
                    //       OptionComponent ?
                    //         <OptionComponent onClick={(e) => {}}
                    //           option={option} isSelected={this.isAlreadySelected(option) !== -1} /> :
                    //         <React.Fragment>
                    //           {
                    //             this.props.multi ?
                    //               <CheckBox filled={true} label={value}
                    //                 onClick={(e) => this.selectOption(e, option)}
                    //                 value={this.isAlreadySelected(option) !== -1} /> :
                    //               <p>{value}</p>
                    //           }
                    //         </React.Fragment>
                    //     }
                    //   </li>
                    // );
                  })}
              {
                !this.state.isLoading && this.state.options && this.state.options.length === 0 &&
                  <li className={styles.option}>No item found</li>
              }
              {
                this.state.isLoading && <li className={styles.option}>Loading ...</li>
              }
            </ul>
            {
              this.props.createNewLabel &&
                  <div key="createNew" className={`${styles.option} ${styles.createNew}`}
                    onClick={() => {this.closeList(); this.props.createNewCallback();}}>
                    {this.props.createNewLabel || 'Create New'}
                  </div>
            }
          </div>
        </this.DropdownWrapper>)}
      </div>
    );
  }
}
