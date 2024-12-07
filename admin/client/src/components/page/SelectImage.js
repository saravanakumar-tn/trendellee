import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Button, TextField, Stack } from "@mui/material";

const SelectImage = (props) => {
  const params = useParams();
  const [images, setImages] = useState(null);
  const [query, setQuery] = useState();
  const [selected, setSelected] = useState("");

  const fetchImages = async (type, query) => {
    const res = await axios.get(`/api/images/${type}/${query}`);
    setImages(res.data.images);
    setQuery(res.data.title);
  };

  const saveImage = async () => {
    if (selected) {
      const res = await axios.post(`/api/save-image/${params.id}`, {
        image: selected,
      });
      alert(res.data.message);
    } else {
      alert("Please select an Image");
    }
  };

  const renderHTML = async () => {
    await axios.get(`/api/render-html/${params.id}`);
    alert("Rerendered");
  };

  const labelCss = (isSelected) => {
    const css = {
      padding: "10px",
      border: "solid 1px #ccc",
      marginBottom: "16px",
    };
    if (isSelected) {
      css.borderColor = "#000";
    }
    return css;
  };

  useEffect(() => {
    fetchImages("id", params.id);
  }, []);

  return images ? (
    <Box>
      <Stack>
        <TextField
          defaultValue={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="button" onClick={() => fetchImages("text", query)}>
          Search
        </Button>
      </Stack>
      {images.map((img) => {
        return (
          <label>
            <input
              type="radio"
              name="page_image"
              value={img.webformatURL}
              style={{ display: "none" }}
              onChange={(e) => setSelected(e.target.value)}
            />
            <img
              src={img.webformatURL}
              alt={img.tags}
              style={labelCss(img.webformatURL === selected)}
            />
          </label>
        );
      })}
      <Stack>
        <Button type="button" onClick={() => saveImage()}>
          Save Image
        </Button>
        <Button type="button" onClick={() => renderHTML()}>
          Render HTML
        </Button>
      </Stack>
    </Box>
  ) : (
    <h3>Loading...</h3>
  );
};

export default SelectImage;
