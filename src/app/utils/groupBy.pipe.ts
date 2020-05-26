import { Pipe, PipeTransform } from "@angular/core";

//groupBy function allows user to group the object that based on the same value in the currect level.
@Pipe({ name: "groupBy" })
export class GroupByPipe implements PipeTransform {
  transform(value: Array<any>, field: string): Array<any> {
    const groupedObj = value.reduce((prev, cur) => {
      if (!prev[cur[field]]) {
        prev[cur[field]] = [cur];
      } else {
        prev[cur[field]].push(cur);
      }
      return prev;
    }, {});
    return Object.keys(groupedObj).map((key) => ({
      key,
      value: groupedObj[key],
    }));
  }
}

//groupByProperty function allows user to group the object that based on the same value in the children level.
@Pipe({ name: "groupByProperty" })
export class GroupByPropertyPipe implements PipeTransform {
  transform(value: Array<any>, property: string): Array<any> {
    if (!value) {
      return null;
    }
    const group = value.reduce((previous, current) => {
      const parts = property.split(".");
      let currentValue: any;
      parts.forEach((part) => {
        currentValue = currentValue ? currentValue[part] : current[part];
      });
      // Stringify objects for comparison
      currentValue =
        typeof currentValue === "object"
          ? JSON.stringify(currentValue)
          : currentValue;
      if (!previous[currentValue]) {
        previous[currentValue] = [current];
      } else {
        previous[currentValue].push(current);
      }
      return previous;
    }, {});
    return Object.keys(group).map((key) => ({ key, value: group[key] }));
  }
}
