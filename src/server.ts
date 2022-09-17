import express, { Request, Response } from "express";
import { filterImageFromURL, deleteLocalFiles, isImage } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  app.use(express.json());

  app.get("/", async (req: Request, res: Response) => {
    res.status(200).send("Welcome");
  });

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const { image_url } = req.query;
    if (!image_url) {
      return res
        .status(400)
        .json({ success: false, message: "Please supply an Image url" });
    }

    //validate image
    //@ts-ignore
    if (!isImage(image_url)) {
      return res
        .status(400)
        .json({ success: false, message: "Please supply a valid image url " });
    }

    //filter image
    //@ts-ignore
    filterImageFromURL(image_url).then((imagePath) => {
      res.status(200).sendFile(imagePath, () => {
        deleteLocalFiles([imagePath]);
      });
    });
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
