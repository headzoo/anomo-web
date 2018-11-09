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
    tags:           PropTypes.array.isRequired,
    selected:       PropTypes.array,
    isTagsLoading:  PropTypes.bool.isRequired,
    visibleModals:  PropTypes.object.isRequired,
    uiVisibleModal: PropTypes.func.isRequired,
    anomoTagsFetch: PropTypes.func.isRequired,
    onSave:         PropTypes.func
  };

  static defaultProps = {
    selected: [],
    onSave:   () => {}
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      tags:        props.tags,
      selected:    props.selected,
      createValue: ''
    };
    this.createInput = React.createRef();
  }

  /**
   *
   */
  componentDidMount = () => {
    const { anomoTagsFetch } = this.props;

    anomoTagsFetch();
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
    }
  };

  /**
   *
   */
  handleClose = () => {
    const { uiVisibleModal } = this.props;

    uiVisibleModal('tags', false);
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
    const { selected } = this.state;

    let found = false;
    const newSelected = [];
    const isChecked   = e.target.checked;
    selected.forEach((t) => {
      if (t.TagID === tag.TagID) {
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
    const { isTagsLoading, visibleModals, ...props } = this.props;
    const { tags, selected, createValue } = this.state;

    if (visibleModals.tags === false) {
      return null;
    }

    const selectedIDs = selected.map((tag) => {
      return tag.TagID;
    });

    const footer = (
      <ModalFooter>
        <Button disabled={isTagsLoading} onClick={this.handleSaveClick}>
          Save
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
        title="Interests"
        footer={footer}
        className="modal-tags modal-list"
        onClosed={this.handleClose}
        {...rest}
      >
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
        {isTagsLoading ? (
          <div className="gutter">
            <Loading className="text-center" />
          </div>
        ) : (
          <ul className="gutter-top">
            {tags.map(tag => (
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
            ))}
          </ul>
        )}
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tags:          state.anomo.tags,
    isTagsLoading: state.anomo.isTagsLoading,
    visibleModals: state.ui.visibleModals
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions, anomoActions)
)(TagsModal);
