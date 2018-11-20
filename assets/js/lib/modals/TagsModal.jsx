import React from 'react';
import PropTypes from 'prop-types';
import { objects, connect, mapActionsToProps } from 'utils';
import { Modal, ModalFooter, Badge, Button } from 'lib/bootstrap';
import { Input } from 'lib/forms';
import { Loading } from 'lib';
import * as uiActions from 'actions/uiActions';
import * as anomoActions from 'actions/anomoActions';

/**
 *
 */
class TagsModal extends React.PureComponent {
  static propTypes = {
    tags:              PropTypes.array,
    intents:           PropTypes.array,
    selected:          PropTypes.array,
    isIntents:         PropTypes.bool,
    isTagsLoading:     PropTypes.bool.isRequired,
    isIntentsLoading:  PropTypes.bool.isRequired,
    visibleModals:     PropTypes.object.isRequired,
    uiVisibleModal:    PropTypes.func.isRequired,
    anomoTagsFetch:    PropTypes.func.isRequired,
    anomoIntentsFetch: PropTypes.func.isRequired,
    onSave:            PropTypes.func
  };

  static defaultProps = {
    tags:      [],
    intents:   [],
    selected:  [],
    isIntents: false,
    onSave:    () => {}
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      tags:        props.tags,
      intents:     props.intents,
      selected:    props.selected,
      createValue: ''
    };
    this.createInput = React.createRef();
  }

  /**
   *
   */
  componentDidMount = () => {
    const { isIntents, anomoTagsFetch, anomoIntentsFetch } = this.props;

    if (isIntents) {
      anomoIntentsFetch();
    } else {
      anomoTagsFetch();
    }
  };

  /**
   * @param {*} prevProps
   * @param {*} prevState
   */
  componentDidUpdate = (prevProps, prevState) => {
    if (objects.isEqual(prevState, this.state)) {
      if (!objects.isEqual(prevProps.selected, this.props.selected)) {
        this.setState({ selected: this.props.selected });
      }
      if (!objects.isEqual(prevProps.tags, this.props.tags)) {
        this.setState({ tags: this.props.tags });
      }
      if (!objects.isEqual(prevProps.intents, this.props.intents)) {
        this.setState({ intents: this.props.intents });
      }
    }
  };

  /**
   * @param {Event} e
   */
  handleSaveClick = (e) => {
    const { onSave } = this.props;
    const { selected } = this.state;

    onSave(e, selected);
  };

  /**
   * @param {Event} e
   * @param {*} tag
   */
  handleCheckboxChange = (e, tag) => {
    const { isIntents } = this.props;
    const { selected } = this.state;

    let found = false;
    const newSelected = [];
    const isChecked   = e.target.checked;

    selected.forEach((t) => {
      if (isIntents && t.IntentID === tag.IntentID) {
        if (isChecked) {
          newSelected.push(t);
        }
        found = true;
        return;
      }
      if (!isIntents && t.TagID === tag.TagID) {
        if (isChecked) {
          newSelected.push(t);
        }
        found = true;
        return;
      }
      newSelected.push(t);
    });
    if (!found) {
      newSelected.push(tag);
    }

    this.setState({ selected: newSelected });
  };

  /**
   *
   */
  handleCreateClick = () => {
    const { tags, selected } = this.state;

    const tag = {
      TagID: this.createInput.current.getValue(),
      Name:  this.createInput.current.getValue()
    };
    tags.unshift(tag);
    selected.push(tag);
    this.setState({ tags, selected, createValue: '' });
  };

  /**
   * @returns {*}
   */
  render() {
    const { isIntents, isTagsLoading, isIntentsLoading, ...props } = this.props;
    const { tags, intents, selected, createValue } = this.state;

    let selectedIDs = [];
    if (isIntents) {
      selectedIDs = selected.map((intent) => {
        return intent.IntentID;
      });
    } else {
      selectedIDs = selected.map((tag) => {
        return tag.TagID;
      });
    }

    const footer = (
      <ModalFooter>
        <Button disabled={isTagsLoading || isIntentsLoading} onClick={this.handleSaveClick}>
          Select
        </Button>
      </ModalFooter>
    );

    const rest = objects.propsFilter(
      props,
      TagsModal.propTypes,
      uiActions,
      anomoActions
    );

    return (
      <Modal
        name="tags"
        footer={footer}
        className="modal-tags modal-list"
        title={isIntents ? 'Intents' : 'Interests'}
        {...rest}
      >
        {!isIntents && (
          <div className="modal-tags-create-container">
            <Input
              name="create"
              value={createValue}
              ref={this.createInput}
              className="full-width"
              id="modal-tags-create"
              placeholder="Add new interest"
              onChange={(e, value) => { this.setState({ createValue: value }); }}
            />
            <Button onClick={this.handleCreateClick}>Add</Button>
          </div>
        )}
        {(isTagsLoading || isIntentsLoading) ? (
          <div className="gutter">
            <Loading className="text-center" />
          </div>
        ) : (
          <ul className="gutter-top">
            {isIntents ? (
              intents.map(intent => (
                <li key={intent.IntentID}>
                  <Badge className="profile-badge-tag">
                    <input
                      type="checkbox"
                      checked={selectedIDs.indexOf(intent.IntentID) !== -1}
                      onChange={e => this.handleCheckboxChange(e, intent)}
                    />
                    {intent.Name}
                  </Badge>
                </li>
              ))
            ) : (
              tags.map(tag => (
                <li key={tag.TagID}>
                  <Badge className="profile-badge-tag">
                    <input
                      type="checkbox"
                      checked={selectedIDs.indexOf(tag.TagID) !== -1}
                      onChange={e => this.handleCheckboxChange(e, tag)}
                    />
                    {tag.Name}
                  </Badge>
                </li>
              ))
            )}
          </ul>
        )}
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tags:             state.anomo.tags,
    intents:          state.anomo.intents,
    isTagsLoading:    state.anomo.isTagsLoading,
    isIntentsLoading: state.anomo.isIntentsLoading,
    visibleModals:    state.ui.visibleModals
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions, anomoActions)
)(TagsModal);
