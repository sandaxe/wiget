import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const ValidateHelper = {
  required: (value) => {
    let errorMessage = "This field is required";
    if(Array.isArray(value)) {
      return value.length === 0 ? errorMessage : "";
    }
    if(typeof value === 'number' && isNaN(value)) {
      return errorMessage;
    } else if(typeof value === 'string' && !value.trim()) {
      return errorMessage;
    }else if(!value) {
      return errorMessage;
    }
    return "";
  },

  numberOnly: (value) => {
    return isNaN(value) ? "Value shuld be number" : "";
  },

  email: (value) => {
    let r = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
    return r.test(value) ?
      "" :
      "Invalid Email Id";
  },

  maxLength: (maxLength) => (value) => {
    if(value.length > maxLength) {
      return `Value can not exceed ${maxLength} characters`;
    }
    return "";
  },

  url: (value) => {
    // https://gist.github.com/dperini/729294
    let r = /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return (!value || r.test(value)) ? "" : "Invalid URL";
  }
};


/* export function Validate(field, validations, cb, extraValidators) {
  let error = {};
  var allValidators = Validators;
  if(extraValidators) {
    allValidators = Object.assign(extraValidators, Validators);
  }
  validations.forEach((validation) => {
    let isInvalid = allValidators[validation](field.Value);
    if(isInvalid) {
      error[field.Name] = isInvalid;
    }else {
      Reflect.deleteProperty(error, field.Name);
    }
  });
  cb(error);
} */

export class Validator extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
      PropTypes.array
    ]),
    trigger: PropTypes.string,
    validations: PropTypes.arrayOf(PropTypes.func),
    onValidate: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node)
    ])
  }

  // static defaultProps = {
  //   trigger: "onChange"
  // }

  constructor(props) {
    super(props);
    this.validate = this.validate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.error = {
      [this.props.name]: false
    };
  }

  componentWillReceiveProps(newProps) {
    //console.log('is different', this.props.value, newProps.value);
    if(!this.props.trigger && this.isDifferent(this.props.value, newProps.value)) {
      //console.log('values are different', this.props.value, newProps.value);
      this.validate(newProps);
      this.props.onValidate(this.error);
    }
  }

  isDifferent(oldValue, newValue) {
    if(Array.isArray(oldValue)) {
      return oldValue.length !== newValue.length;
    }
    //console.log('oldValue , newValue', oldValue, newValue);
    return oldValue !== newValue;
  }

  onChange(evt) {
    this.validate(this.props);
    this.props.onValidate(this.error);
  }

  triggerValidate() {
    this.validate(this.props);
    return this.error;
  }

  validate(props) {
    this.error = {};
    props = props || this.props;
    for (let i = 0; i < props.validations.length; i++) {
      let validation = props.validations[i];
      let isInvalid = validation(props.value);
      this.error[props.name] = isInvalid;
      if(isInvalid) {
        break;
      }
      //Reflect.deleteProperty(this.error, props.name);
    }
    return this.error;
  }

  render() {
    var child = React.Children.only(this.props.children);
    var extraProps = this.props.trigger ? {
      [this.props.trigger]: this.onChange
    } : {};
    if (child.props[this.props.trigger]) {
      extraProps[this.props.trigger] = createChainedFunction(this.onChange, child.props[this.props.trigger]);
    }
    return (
      React.cloneElement(child, extraProps)
    );
  }
}

export class Validation extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node)
    ]).isRequired
  }

  constructor(props) {
    super(props);
    this.validate = this.validate.bind(this);
    this.getChildrenRef = this.getChildrenRef.bind(this);
    this.allValidations = {};
    this.isSubmitted = false;
  }

  validate() {
    this.error = {};
    Object.values(this.allValidations).forEach((validationRef) => {
      //let error = validationRef ? validationRef.triggerValidate() : {};
      let error = validationRef.triggerValidate();
      //console.log('Individual error', error);
      this.error = Object.assign(this.error, error);
    });
    //console.log("All error", this.error);
    return this.error;
  }

  getChildrenRef(validator) {
    return (validatorRef) => {
      //Ref callback will be called with null when componenet unmount or update since we return new function
      if(!validatorRef) {
        Reflect.deleteProperty(this.allValidations, validator.props.name);
        return;
      }
      this.allValidations[validator.props.name] = validatorRef;
    };
  }

  getValidationChildRef(children) {
    // remove all old validationRef when component re-renders
    this.allValidations = {};

    if(!children) return children;
    const type = typeof children;
    if (type === 'boolean') {
      return children;
    }
    if (type === 'string' || type === 'number') {
      return children;
    }
    return React.Children.map(children, (child) => {
      if(!React.isValidElement(child)) {
        return child;
      }
      if (child && child.type === Validator) {
        return React.cloneElement(child, { ref: this.getChildrenRef(child) });
      } else if(child.props.children) {
        let result = this.getValidationChildRef(child.props.children);
        if(result.length === 1) {
          result = result[0];
        }
        return React.cloneElement(child, {}, result);
      }
      return child;
    });
  }

  render() {
    return this.getValidationChildRef(this.props.children);
  }
}

function createChainedFunction() {
  var args = arguments;
  return function chainedFunction() {
    for (var i = 0; i < args.length; i++) {
      if (args[i] && args[i].apply) {
        //args[i].apply(this, arguments);
        Reflect.apply(args[i], this, arguments);
      }
    }
  };
}
