import React from "react";
import { Admin, Resource } from "react-admin";
import dataProvider from "./dataProvider.js";

import CategoryList from "./components/category/CategoryList.js";
import CategoryCreate from "./components/category/CategoryCreate.js";
import CategoryEdit from "./components/category/CategoryEdit.js";

import RegionList from "./components/region/RegionList.js";
import RegionCreate from "./components/region/RegionCreate.js";
import RegionEdit from "./components/region/RegionEdit.js";

import TrendList from "./components/trend/TrendList.js";
import TrendCreate from "./components/trend/TrendCreate.js";
import TrendEdit from "./components/trend/TrendEdit.js";

import PageList from "./components/page/PageList.js";
import PageCreate from "./components/page/PageCreate.js";
import PageEdit from "./components/page/PageEdit.js";

const App = () => {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource
        name="categories"
        list={CategoryList}
        edit={CategoryEdit}
        create={CategoryCreate}
      />
      <Resource
        name="regions"
        list={RegionList}
        edit={RegionEdit}
        create={RegionCreate}
      />
      <Resource
        name="trends"
        list={TrendList}
        edit={TrendEdit}
        create={TrendCreate}
      />
      <Resource
        name="pages"
        list={PageList}
        edit={PageEdit}
        create={PageCreate}
      />
    </Admin>
  );
};

export default App;
