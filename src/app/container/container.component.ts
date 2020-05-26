import { Component, OnInit, ViewChildren, QueryList } from "@angular/core";
import { MatExpansionPanel } from "@angular/material/expansion";
import { CharactersService } from "../characters.service";

@Component({
  selector: "app-container",
  templateUrl: "./container.component.html",
  styleUrls: ["./container.component.scss"],
})
export class ContainerComponent implements OnInit {
  payload: Object = {};

  panelOpenState: boolean = false;
  _allExpandState: any = false;

  profileGroupTemplate = [
    {
      sectionHeader: "profileGroup",
      fieldsList: [
        {
          fieldDisplayOrder: 1,
          name: "name",
          groupName: "R2",
        },
        {
          fieldDisplayOrder: 2,
          name: "gender",
          groupName: "R2",
        },
        {
          fieldDisplayOrder: 3,
          name: "age",
          groupName: "R2",
        },
        {
          fieldDisplayOrder: 4,
          name: "rank",
          groupName: "R2",
        },
        {
          fieldDisplayOrder: 5,
          name: "image",
          groupName: "R2",
        },
      ],
    },
  ];

  constructor(private charactersService: CharactersService) {}

  async ngOnInit() {
    await this.charactersService
      .getCharacters()
      .toPromise()
      .then((response) => {
        this.payload = response;
        return response;
      });

    this.sortByOrder(this.payload["section"]);

    console.log(this.payload);
  }

  // uppercase all the letters and replace _ with -
  capitalizedLettersAndChangeUnderscoreWithDash(str) {
    const words = str.split("_");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].toUpperCase();
    }
    return words.join("-");
  }

  sortByOrder(data) {
    data.forEach((section) => {
      section.paramList.forEach((field) => {
        if (field.type == "profileGroup") {
          const parsedJson = JSON.parse(field.value);
          field.value = parsedJson;

          field.value.map((fieldObj) => {
            let keys = Object.keys(fieldObj);
            this.profileGroupTemplate.map((layout) => {
              layout.fieldsList.map((layoutObj) => {
                for (let key of keys) {
                  if (key == layoutObj.name) {
                    field[key] = layoutObj;
                    console.log(field[key]);
                  }
                }
              });
            });
          });
        }
      });
    });

    data.map((section) => {
      section.paramList.forEach((obj) => {
        if (obj.detailObject) {
          // Create temp vars to hold the section and group display order.
          let tempFieldDisplayOrder;
          tempFieldDisplayOrder = obj.detailObject.fieldDisplayOrder;

          // Assign those order value to their parent level so it's easier for sorting
          obj["fieldDisplayOrder"] = tempFieldDisplayOrder;
        }
      });

      // Sort based on field ID
      data.map((section) => {
        section.paramList.sort((a, b) => a.id - b.id);
      });

      // Sort based on field, row, and group display order number
      data.map((section) => {
        section.paramList.sort(
          (a, b) => a.fieldDisplayOrder - b.fieldDisplayOrder
        );
      });
    });

    console.log(data);
  }

  getVal(obj) {
    if (typeof obj == "object") {
      if (Object.keys(obj)[1]) {
        return Object.values(obj)[0] + "-" + Object.values(obj)[1];
      } else {
        return Object.values(obj)[0] + "-";
      }
    } else {
      return obj;
    }
  }

  keyDisplayAscOrder = (a, b): number => {
    let aOrder = this.getFieldDisplayOrder(a.key);
    let bOrder = this.getFieldDisplayOrder(b.key);

    return aOrder < bOrder ? -1 : bOrder < aOrder ? 1 : 0;
  };

  getFieldDisplayOrder(key) {
    let fieldDisplayOrder;
    this.profileGroupTemplate.map((layout) => {
      layout.fieldsList.map((layoutObj) => {
        if (key == layoutObj.name) {
          fieldDisplayOrder = layoutObj.fieldDisplayOrder;
        }
      });
    });
    return fieldDisplayOrder;
  }

  public set allExpandState(value: boolean) {
    this._allExpandState = value;
    this.togglePanels(value);
  }

  public get allExpandState(): boolean {
    return this._allExpandState;
  }

  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>;

  public togglePanels(value: boolean) {
    this.viewPanels.forEach((p) => (value ? p.open() : p.close()));
  }
}
