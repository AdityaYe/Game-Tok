const clipModel =
  require("../models/clip.model")



const userModel =
  require("../models/user.model")



async function searchAll(
  req,
  res
) {

  try {

    const query =
      req.query.q || ""



    if (!query.trim()) {

      return res.status(200).json({

        creators: [],

        clips: [],

        tags: [],

      })

    }



    /* SEARCH CREATORS */

    const creators =

      await userModel.find({

        name: {

          $regex: query,

          $options: "i",

        },

      })

      .select(

        "name avatar isVerified"

      )

      .limit(5)



    /* SEARCH CLIPS */

    const clips =

      await clipModel.find({

        gameName: {

          $regex: query,

          $options: "i",

        },

      })

      .select(

        "gameName thumbnail"

      )

      .limit(5)



    /* SEARCH TAGS */

    const tagClips =

      await clipModel.find({

        tags: {

          $regex: query,

          $options: "i",

        },

      })

      .select("tags")



    const tags = [

      ...new Set(

        tagClips.flatMap(

          (clip) => clip.tags

        )

      ),

    ]



    res.status(200).json({

      creators,

      clips,

      tags,

    })

  } catch (err) {

    console.log(err)

    res.status(500).json({

      message:
        "Search failed",

    })

  }

}



module.exports = {

  searchAll,

}