const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listings.js")


// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("success test")
// })

//Show Route / Index Route (to show all the listings)
// router.get("/", wrapAsync(listingController.index));

//New Route
// router.get("/new", isLoggedIn , listingController.renderNewForm);

//Show Route (to show detail of a particular listing)
// router.get(
//     "/:id",
//     wrapAsync(listingController.showListing)
// );

//New Route (to create new listing) or Create Route
// router.post(
//     "/", 
//     isLoggedIn,
//     validateListing, 
//     wrapAsync(listingController.createListing)
// );



//Edit Route (to edit information)
// router.get(
//     "/:id/edit", 
//     isLoggedIn, 
//     isOwner, 
//     wrapAsync(listingController.renderEditForm)
// )

//Update route (to update the edited info in database)
// router.patch(
//     "/:id",
//     isLoggedIn,
//     isOwner,
//     validateListing, 
//     wrapAsync(listingController.updateListing)
// )

//Delete Route(to delete a particular listing)
// router.delete(
//     "/:id", 
//     isLoggedIn, 
//     isOwner, 
//     wrapAsync(listingController.destroyListing)
// );


router
   .route("/")
   .get(wrapAsync(listingController.index))
   .post(
        isLoggedIn,
        validateListing, 
        upload.single('listing[image]'),
        wrapAsync(listingController.createListing)
    );
    // .post( upload.single('listing[image]'), (req, res) => {
    //     console.log(req.file);
    // })

// New Route
router.get("/new", isLoggedIn , listingController.renderNewForm);

router
    .route("/:id")
    .get(
        wrapAsync(listingController.showListing)
    )
    .patch(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing, 
        wrapAsync(listingController.updateListing)
    )
    .delete( 
        isLoggedIn, 
        isOwner, 
        wrapAsync(listingController.destroyListing)
    );


//Edit Route (to edit information)
router.get(
    "/:id/edit", 
    isLoggedIn, 
    isOwner, 
    wrapAsync(listingController.renderEditForm)
)

module.exports = router;