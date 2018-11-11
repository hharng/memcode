import * as CourseApi from '~/api/Course';

import disableOnSpeRequest from '~/services/disableOnSpeRequest';
import onClickOutside from 'react-onclickoutside';
import { Course } from './components/Course';

import css from './index.css';

@onClickOutside
class Search extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object
  }

  state = {
    searchString: '',
    courseDatas: [],
    ifDropdownIsOpen: false
  }

  handleClickOutside = () =>
    this.clearAndCloseDropdown()

  apiSearch = (searchString) =>
    CourseApi.selectSearch(
      (spe) => this.setState({ speSearch: spe }),
      searchString
    )
      .then((courseDatas) => {
        if (this.state.searchString === searchString) {
          this.setState({ courseDatas });
        }
      })

  updateSearchString = (event) => {
    const searchString = event.target.value;
    this.setState({ searchString });
    if (searchString.length === 0) {
      this.clearAndCloseDropdown();
    } else {
      if (this.state.ifDropdownIsOpen === false) {
        this.setState({ ifDropdownIsOpen: true });
      }
      this.apiSearch(searchString);
    }
  }

  clearAndCloseDropdown = () =>
    this.setState({ ifDropdownIsOpen: false })

  render = () =>
    <section className={`${css.search} search`}>
      <div className="toggler">
        <i className="fa fa-search"/>
        <input
          placeholder="Find a course..."
          onChange={this.updateSearchString}
          value={this.state.searchString}
          type="text"
          autoComplete={false}
          autoCorrect={false}
          autoCapitalize={false}
          spellCheck={false}
        />
      </div>

      {
        this.state.ifDropdownIsOpen &&
        this.state.courseDatas.length > 0 &&
        <div className="standard-beige-dropdown">
          <div className="header">
            <div className="pretty-text">{this.state.courseDatas.length} courses found</div>
          </div>
          <ul style={disableOnSpeRequest(this.state.speSearch, { opacity: 0.9 })}>
            {this.state.courseDatas.map((courseData) =>
              <Course
                key={courseData.course.id}
                courseData={courseData}
                currentUser={this.props.currentUser}
                searchString={this.state.searchString}
              />
            )}
          </ul>
          <div className="footer"/>
        </div>
      }
    </section>
}

export { Search };
