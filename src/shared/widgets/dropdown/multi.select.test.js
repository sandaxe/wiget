import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';


import { MultiSelect } from './index.js';
import styles from './multi.select.css';

describe('multiSelect test', () => {
  beforeAll(() => {
    const div = document.createElement('div');
    window.domNode = div;
    document.body.appendChild(div);
  });

  it('should render select box', () => {
    let multiSelect = mount(<MultiSelect />, { attachTo: window.domNode });
    expect(multiSelect).toBeDefined();
  });

  it('should render the drop-down list', () => {
    let options = [
      'India',
      'Japan',
      'Russia',
      'China'
    ];

    const countryList = mount(
      <MultiSelect options={options}/>,
      { attachTo: window.domNode }
    );
    countryList.find('.selectBox').simulate('click');
    countryList.update();
    expect(countryList.find('ul > li').length).toBe(options.length);
  });

  it('should select option', () => {
    let options = [
      'India',
      'Japan',
      'Russia',
      'China'
    ];
    const onSelect = sinon.spy();
    const onUpdate = sinon.spy();
    const countryList = mount(
      <MultiSelect options={options} onSelect={onSelect} onUpdate={onUpdate}/>,
      { attachTo: window.domNode }
    );
    countryList.find('.selectBox').simulate('click');
    countryList.update();
    countryList.find('[type="checkbox"]').first().simulate('click');
    expect(onSelect.calledWith('India')).toBeTruthy();

    // close the list
    countryList.find('.selectBox').simulate('click');
    countryList.update();
    expect(countryList.find('ul').exists()).toBeFalsy();
    expect(onUpdate.calledWith(['India']));
  });

  describe('multiselect test cases for list of strings', () => {
    let options = [
      'India',
      'Japan',
      'Russia',
      'China'
    ];
    const onSelect = sinon.spy();
    const onUpdate = sinon.spy();
    const onRemove = sinon.spy();
    let countryList = null;

    beforeEach(() => {
      countryList = mount(
        <MultiSelect options={options} onRemove={onRemove} onSelect={onSelect} onUpdate={onUpdate}/>,
        { attachTo: window.domNode }
      );
    });

    afterEach(() => {
      onSelect.resetHistory();
      onUpdate.resetHistory();
      onRemove.resetHistory();
    });

    it('should select option', () => {
      countryList.find('.selectBox').simulate('click');
      countryList.update();
      countryList.find('[type="checkbox"]').first().simulate('click');
      expect(countryList.state().selectedOptions.length).toEqual(1);
      expect(onSelect.calledWith('India')).toBeTruthy();

      // close the list
      countryList.find('.selectBox').simulate('click');
      countryList.update();
      expect(countryList.find('ul').exists()).toBeFalsy();
      expect(onUpdate.calledWith(['India']));
    });

    it('should filter the list', () => {
      countryList.find('.selectBox').simulate('click');
      countryList.update();
      let mockEvent = {
        persist: () => {},
        target: {
          value: "In"
        }
      };
      countryList.find('.searchBox > input').simulate('change', mockEvent);
      //to wait for debounce to fire
      setTimeout(() => {
        countryList.update();
        expect(countryList.find('ul > li').length).toBe(1);
      }, 400);
    });

    it('should render the selected option as chip', () => {
      countryList.find('.selectBox').simulate('click');
      countryList.update();
      countryList.find('[type="checkbox"]').first().simulate('click');
      countryList.update();
      expect(countryList.find('.chip').length).toBe(1);
      expect(onSelect.calledOnce).toBeTruthy();
    });

    it('clear the selected option chip', () => {
      countryList.find('.selectBox').simulate('click');
      countryList.update();
      countryList.find('[type="checkbox"]').first().simulate('click');
      countryList.update();
      expect(countryList.state().selectedOptions.length).toBe(1);
      countryList.find('.chip > span').last().simulate('click');
      expect(onRemove.calledOnce).toBeTruthy();
      expect(countryList.state().selectedOptions.length).toBe(0);
    });
  });


  describe('multiselect test cases for list of objects', () => {
    let options = [
      { name: 'India' },
      { name: 'Japan' },
      { name: 'Russia' },
      { name: 'China' }
    ];
    const onSelect = sinon.spy();
    const onUpdate = sinon.spy();
    const onRemove = sinon.spy();
    let countryList = null;

    beforeEach(() => {
      countryList = mount(
        <MultiSelect label="name" options={options} onRemove={onRemove} onSelect={onSelect} onUpdate={onUpdate}/>,
        { attachTo: window.domNode }
      );
    });

    afterEach(() => {
      onSelect.resetHistory();
      onUpdate.resetHistory();
      onRemove.resetHistory();
    });

    it('should select option', () => {
      countryList.find('.selectBox').simulate('click');
      countryList.update();
      countryList.find('[type="checkbox"]').first().simulate('click');
      expect(countryList.state().selectedOptions.length).toEqual(1);
      expect(onSelect.calledWith({ name: 'India' })).toBeTruthy();

      // close the list
      countryList.find('.selectBox').simulate('click');
      countryList.update();
      expect(countryList.find('ul').exists()).toBeFalsy();
      expect(onUpdate.calledWith([{ name: 'India' }]));
    });

    it('should filter the list', () => {
      countryList.find('.selectBox').simulate('click');
      countryList.update();
      let mockEvent = {
        persist: () => {},
        target: {
          value: "In"
        }
      };
      countryList.find('.searchBox > input').simulate('change', mockEvent);
      //to wait for debounce to fire
      setTimeout(() => {
        countryList.update();
        expect(countryList.find('ul > li').length).toBe(1);
      }, 400);
    });

    it('should render the selected option as chip', () => {
      countryList.find('.selectBox').simulate('click');
      countryList.update();
      countryList.find('[type="checkbox"]').first().simulate('click');
      countryList.update();
      expect(countryList.find('.chip').length).toBe(1);
      expect(onSelect.calledOnce).toBeTruthy();
    });

    it('clear the selected option chip', () => {
      countryList.find('.selectBox').simulate('click');
      countryList.update();
      countryList.find('[type="checkbox"]').first().simulate('click');
      countryList.update();
      expect(countryList.state().selectedOptions.length).toBe(1);
      countryList.find('.chip > span').last().simulate('click');
      expect(onRemove.calledOnce).toBeTruthy();
      expect(countryList.state().selectedOptions.length).toBe(0);
    });
  });
});
