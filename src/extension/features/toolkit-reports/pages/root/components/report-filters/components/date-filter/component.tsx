import * as React from 'react';
import * as PropTypes from 'prop-types';
import { getFirstMonthOfBudget, getToday } from 'toolkit/extension/utils/date';
import { l10nMonth } from 'toolkit/extension/utils/toolkit';
import './styles.scss';
import { FiltersType } from 'toolkit/extension/features/toolkit-reports/common/components/report-context';
import { DateWithoutTime } from 'toolkit/types/ynab/window/ynab-utilities';

const Options = {
  ThisMonth: 'This Month',
  LastMonth: 'Last Month',
  LatestThree: 'Latest 3 Months',
  LatestSix: 'Latest 6 Months',
  LatestTwelve: 'Latest 12 Months',
  ThisYear: 'This Year',
  LastYear: 'Last Year',
  AllDates: 'All Dates',
};

export type DateFilterProps = {
  activeReportKey: string;
  dateFilter: FiltersType['dateFilter'];
  onCancel: VoidFunction;
  onSave: (filter: FiltersType['dateFilter']) => void;
};

type DateFilterState = {
  selectedFromMonth: string | number;
  selectedFromYear: string | number;
  selectedToMonth: string | number;
  selectedToYear: string | number;
};

export class DateFilterComponent extends React.Component<DateFilterProps, DateFilterState> {
  get firstMonthOfBudget() {
    return getFirstMonthOfBudget();
  }

  get startOfThisMonth() {
    return getToday().startOfMonth();
  }

  state = {
    selectedFromMonth: this.props.dateFilter.fromDate.getMonth(),
    selectedFromYear: this.props.dateFilter.fromDate.getYear(),
    selectedToMonth: this.props.dateFilter.toDate.getMonth(),
    selectedToYear: this.props.dateFilter.toDate.getYear(),
  };

  render() {
    return (
      <div className="tk-pd-1">
        <h3 className="tk-mg-0">Date Range</h3>
        <div className="tk-flex tk-mg-t-1 tk-mg-b-05 tk-pd-y-05 tk-border-y tk-modal-content__header-actions">
          <button
            name={Options.ThisMonth}
            className="tk-button tk-button--small tk-button--text"
            onClick={this._handleOptionSelected}
          >
            {Options.ThisMonth}
          </button>
          <button
            name={Options.LastMonth}
            className="tk-button tk-button--small tk-button--text tk-mg-l-05"
            onClick={this._handleOptionSelected}
          >
            {Options.LastMonth}
          </button>
          <button
            name={Options.LatestThree}
            className="tk-button tk-button--small tk-button--text tk-mg-l-05"
            onClick={this._handleOptionSelected}
          >
            {Options.LatestThree}
          </button>
          <button
            name={Options.LatestSix}
            className="tk-button tk-button--small tk-button--text tk-mg-l-05"
            onClick={this._handleOptionSelected}
          >
            {Options.LatestSix}
          </button>
          <button
            name={Options.LatestTwelve}
            className="tk-button tk-button--small tk-button--text tk-mg-l-05"
            onClick={this._handleOptionSelected}
          >
            {Options.LatestTwelve}
          </button>
          <button
            name={Options.ThisYear}
            className="tk-button tk-button--small tk-button--text tk-mg-l-05"
            onClick={this._handleOptionSelected}
          >
            {Options.ThisYear}
          </button>
          <button
            name={Options.LastYear}
            className="tk-button tk-button--small tk-button--text tk-mg-l-05"
            onClick={this._handleOptionSelected}
          >
            {Options.LastYear}
          </button>
          <button
            name={Options.AllDates}
            className="tk-button tk-button--small tk-button--text tk-mg-l-05"
            onClick={this._handleOptionSelected}
          >
            {Options.AllDates}
          </button>
        </div>
        <div className="tk-flex tk-justify-content-around">
          <div className="tk-flex tk-align-items-center">
            <div className="tk-mg-r-05">From:</div>
            <select
              className="tk-date-filter__select"
              value={this.state.selectedFromMonth}
              onChange={this._handleFromMonthSelected}
            >
              {this._renderEligibleMonths(this.state.selectedFromYear)}
            </select>
            <select
              className="tk-date-filter__select tk-mg-l-05"
              value={this.state.selectedFromYear}
              onChange={this._handleFromYearSelected}
            >
              {this._renderEligibleYears()}
            </select>
          </div>
          <div className="tk-flex tk-align-items-center">
            <div className="tk-mg-r-05">To:</div>
            <select
              className="tk-date-filter__select"
              value={this.state.selectedToMonth}
              onChange={this._handleToMonthSelected}
            >
              {this._renderEligibleMonths(this.state.selectedToYear)}
            </select>
            <select
              className="tk-date-filter__select tk-mg-l-05"
              value={this.state.selectedToYear}
              onChange={this._handleToYearSelected}
            >
              {this._renderEligibleYears()}
            </select>
          </div>
        </div>
        <div className="tk-flex tk-justify-content-end tk-mg-t-1">
          <button className="tk-button tk-button--hollow" onClick={this.props.onCancel}>
            Cancel
          </button>
          <button className="tk-button tk-mg-l-05" onClick={this._save}>
            Done
          </button>
        </div>
      </div>
    );
  }

  _getEligibleMonths(selectedYear: number) {
    const today = getToday();
    const date = ynab.utilities.DateWithoutTime.createForToday();
    date.startOfYear().setYear(selectedYear);

    const options = [];
    // HTML values are converted to string and that's what's stored in state so
    // we need to convert `.getYear()` into a string.
    while (date.getYear().toString() === selectedYear.toString()) {
      options.push({
        disabled: date.isAfter(today) || date.isBefore(this.firstMonthOfBudget),
        month: date.getMonth(),
      });

      date.addMonths(1);
    }

    return options;
  }

  _renderEligibleMonths(selectedYear: number) {
    const eligibleMonths = this._getEligibleMonths(selectedYear);
    return eligibleMonths.map(({ disabled, month }) => (
      <option key={month} disabled={disabled} value={month}>
        {l10nMonth(month)}
      </option>
    ));
  }

  _renderEligibleYears() {
    const today = getToday();
    const date = getFirstMonthOfBudget();

    const options = [];
    while (date.getYear() <= today.getYear()) {
      options.push(
        <option key={date.getYear()} value={date.getYear()}>
          {date.getYear()}
        </option>,
      );

      date.addYears(1);
    }

    return options;
  }

  _handleFromMonthSelected = ({ currentTarget }: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ selectedFromMonth: currentTarget.value });
  };

  _handleFromYearSelected = ({ currentTarget }: React.ChangeEvent<HTMLSelectElement>) => {
    const { selectedFromMonth } = this.state;
    const toDate = ynab.utilities.DateWithoutTime.createForToday();
    toDate.setMonth(selectedFromMonth).setYear(currentTarget.value).startOfMonth();

    let selectedMonth = selectedFromMonth;
    if (toDate.isBefore(this.firstMonthOfBudget)) {
      selectedMonth = this.firstMonthOfBudget.getMonth();
    } else if (toDate.isAfter(this.startOfThisMonth)) {
      selectedMonth = this.startOfThisMonth.getMonth();
    }

    this.setState({ selectedFromMonth: selectedMonth, selectedFromYear: currentTarget.value });
  };

  _handleToMonthSelected = ({ currentTarget }: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ selectedToMonth: currentTarget.value });
  };

  _handleToYearSelected = ({ currentTarget }: React.ChangeEvent<HTMLSelectElement>) => {
    const { selectedToMonth } = this.state;
    const toDate = ynab.utilities.DateWithoutTime.createForToday();
    toDate.setMonth(selectedToMonth).setYear(currentTarget.value).startOfMonth();

    let selectedMonth = selectedToMonth;
    if (toDate.isBefore(this.firstMonthOfBudget)) {
      selectedMonth = this.firstMonthOfBudget.getMonth();
    } else if (toDate.isAfter(this.startOfThisMonth)) {
      selectedMonth = this.startOfThisMonth.getMonth();
    }

    this.setState({ selectedToMonth: selectedMonth, selectedToYear: currentTarget.value });
  };

  _getEligibleMonth(selectedMonth: number, selectedYear: number): DateWithoutTime {
    const date = ynab.utilities.DateWithoutTime.createForToday();
    date.setMonth(selectedMonth).setYear(selectedYear).startOfMonth();

    if (date.isBefore(this.firstMonthOfBudget)) {
      return this.firstMonthOfBudget;
    }
    if (date.isAfter(this.startOfThisMonth)) {
      return this.startOfThisMonth;
    }

    return date;
  }

  _getSelectedFromDates(
    fromDate: FiltersType['dateFilter']['fromDate'],
    toDate: FiltersType['dateFilter']['fromDate'],
  ) {
    const eligibleFromDate = this._getEligibleMonth(fromDate.getMonth(), fromDate.getYear());
    const eligibleToDate = this._getEligibleMonth(toDate.getMonth(), toDate.getYear());

    return {
      selectedFromMonth: eligibleFromDate.getMonth(),
      selectedFromYear: eligibleFromDate.getYear(),
      selectedToMonth: eligibleToDate.getMonth(),
      selectedToYear: eligibleToDate.getYear(),
    };
  }

  _handleOptionSelected = ({ currentTarget }: React.MouseEvent<HTMLButtonElement>) => {
    let selectedDates;
    const today = getToday();

    switch (currentTarget.name) {
      case Options.ThisMonth:
        selectedDates = this._getSelectedFromDates(today, today);
        break;
      case Options.LastMonth:
        const lastMonth = today.clone().subtractMonths(1);
        selectedDates = this._getSelectedFromDates(lastMonth, lastMonth);
        break;
      case Options.LatestThree:
        selectedDates = this._getSelectedFromDates(today.clone().subtractMonths(2), today);
        break;
      case Options.LatestSix:
        selectedDates = this._getSelectedFromDates(today.clone().subtractMonths(5), today);
        break;
      case Options.LatestTwelve:
        selectedDates = this._getSelectedFromDates(today.clone().subtractMonths(11), today);
        break;
      case Options.ThisYear:
        selectedDates = this._getSelectedFromDates(today.clone().startOfYear(), today);
        break;
      case Options.LastYear:
        const startOfLastYear = today.clone().subtractYears(1).startOfYear();
        const endOfLastYear = today.clone().subtractYears(1).endOfYear();
        selectedDates = this._getSelectedFromDates(startOfLastYear, endOfLastYear);
        break;
      case Options.AllDates:
        selectedDates = this._getSelectedFromDates(this.firstMonthOfBudget, today);
        break;
    }

    if (selectedDates) {
      this.setState(selectedDates, this._save);
    }
  };

  _save = () => {
    const { selectedFromMonth, selectedFromYear, selectedToMonth, selectedToYear } = this.state;
    const fromDate = ynab.utilities.DateWithoutTime.createForToday();
    fromDate.setYear(selectedFromYear);
    fromDate.setMonth(selectedFromMonth);
    fromDate.startOfMonth();

    const toDate = ynab.utilities.DateWithoutTime.createForToday();
    toDate.setYear(selectedToYear);
    toDate.setMonth(selectedToMonth);
    toDate.endOfMonth();

    const dateFilters = { toDate, fromDate };
    this.props.onSave(dateFilters);
  };
}
