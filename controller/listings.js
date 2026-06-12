// const listing = require("../models/listing");
// // 1. listings route

// // forward geocoding
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");



// //listings == schemaaa of listings
// // module.exports.index = async(req, res) => {

// //     // whenver our mongo query used we use the ####  async funn
// //     const alllistings = await listing.find({})
// //     res.render("index.ejs", { alllistings });
// // }


// /// CHAt VERSOIN WITH SERCH BAR FEATURE
// const Listing = require("../models/listing.js"); // path ko check karo

// module.exports.index = async(req, res) => {
//     try {
//         let filter = {};

//         // Agar category URL me aaye
//         if (req.query.category) {
//             filter.category = req.query.category.toLowerCase();
//         }

//         // Agar search bar me kuch type kiya ho
//         if (req.query.search) {
//             const searchTerm = req.query.search.toLowerCase();

//             // Title ya category me match ho
//             filter.$or = [
//                 { title: { $regex: searchTerm, $options: "i" } },
//                 { category: { $regex: searchTerm, $options: "i" } }
//             ];
//         }

//         // Listings fetch karo
//         let allListings = await Listing.find(filter);

//         // Agar koi match nahi mila, fallback: sab listings show karo
//         if (!allListings.length) {
//             allListings = await Listing.find({});
//         }

//         res.render("index.ejs", { alllistings: allListings });
//     } catch (err) {
//         console.error(err);
//         req.flash("error", "Something went wrong with search");
//         res.redirect("/listings");
//     }
// };
// //2. NEW route

// module.exports.rendernewform = (req, res) => {

//     console.log(req.user);
//     // this help isAuthenticated()     ====  method to check for a valid user 


//     res.render("listings/new.ejs");
// }



// //3. show route

// module.exports.showing_all_listings = async(req, res) => {
//     let { id } = req.params;

//     const listing_show = await listing.findById(id).populate({
//         path: "reviews",
//         populate: {
//             path: "author"
//         },
//     }).populate("owner").populate("bookings");
//     // here listing is table / collection name


//     /// # if does not find the listings it show popup ##  not the Error
//     if (!listing_show) {
//         req.flash("error", "Listings you requesting is does not exsits !");
//         return res.redirect("/listings");
//     }

//     listing_show.bookings = Array.isArray(listing_show.bookings) ? listing_show.bookings : [];
//     console.log(listing_show);

//     res.render("listings/show.ejs", { listing_show })
//         // path   ==  /folder/file

// }



// //4. create route



// module.exports.create_new_listings = async(req, res, next) => {

//     /// for multiple image upload
//     let images = [];
//     if (req.files && req.files.length > 0) {
//         images = req.files.map((file) => ({
//             url: file.path,
//             filename: file.filename
//         }));
//     }

//     if (!req.body.listing) {
//         throw new Express_Error(400, "Send a valid data for listings")
//     }

//     const newlisting = new listing(req.body.listing);
//     //listing (bahar wla bracket  k)=== table name model(schema),,,,  req.body.listing se jo 
//     // from se object aa ra   usko  variable me dal ke save kar wa re h
//     //listing(indar wla)  == js object

//     //$$  to dispaly the cuurent owner name 
//     newlisting.owner = req.user._id;
//     console.log(req.user)

//     // Store images array
//     newlisting.images = images;
//     // Also set the first image as the main image for backward compatibility
//     if (images.length > 0) {
//         newlisting.image = images[0];
//     }



//     // ===== Forward geocoding =====
//     if (req.body.listing.location) {
//         const address = req.body.listing.location;

//         const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;

//         try {
//             const response = await fetch(geocodeUrl, {
//                 headers: {
//                     "User-Agent": "wanderlust-app" // Nominatim ke liye required hota hai
//                 }
//             });

//             const data = await response.json();

//             if (data.length > 0) {
//                 const lat = parseFloat(data[0].lat);
//                 const lon = parseFloat(data[0].lon);

//                 newlisting.location = address;

//                 // ✅ CORRECT FORMAT FOR GEOJSON
//                 newlisting.geometry = {
//                     type: "Point", // Capital P
//                     coordinates: [lon, lat] // [longitude, latitude]
//                 };

//                 console.log("Latitude:", lat, "Longitude:", lon);
//             } else {
//                 console.log("Address not found:", address);
//             }
//         } catch (err) {
//             console.error("Geocoding error:", err);
//         }
//     }




//     // new data ka insatnce (object)  tyarrr  and save()
//     const saved_listings = await newlisting.save();
//     console.log(saved_listings)
//         //Using the flash here  to pop message 
//     req.flash("success", "New Listings created Successfully!")


//     res.redirect("/listings")
// }

// ///5 . edit route 


// module.exports.edit_listings = async(req, res) => {
//     let { id } = req.params;
//     const Listing = await listing.findById(id);

//     /// # if does not find the listings it show popup ##  not the Error
//     if (!Listing) {
//         req.flash("error", "Listings you requesting is does not exsits !");
//         res.redirect("/listings")
//     }


//     // //Using the flash here  to pop message 
//     req.flash("success", " Listings Edited Successfully!")


//     /// for low qulatiy image preview of original listing img on the edit page 
//     let originalImageUrl = Listing.image.url;
//     originalImageUrl = originalImageUrl.replace("upload", "/upload/w_250")

//     res.render("listings/edit.ejs", { Listing, originalImageUrl })
// }


// //6.update listings


// module.exports.update_listings_form = async(req, res) => {

//     // if (!req.body.listing) {
//     //     throw new Express_Error(400, "Send a valid data for listings")
//     // } // for error handling === agar form se object khaalii chalee jye Too

//     let { id } = req.params;

//     // check for the athurisation 
//     // user is that jisne ki listings ko banaya h
//     // const checklisting = await listing.findByIdAndUpdate(id);
//     // if (!checklisting.owner._id.equals(res.locals.currUser._id)) {
//     //     req.flash("error", "Access denied! Insufficient permissions 🔒")

//     //     return res.redirect(`/listings/${id}`)
//     // }

//     const updatedListing = await listing.findByIdAndUpdate(id, {...req.body.listing });

//     //@@  NEW IMAGES UPLOAD LOGIC
//     // check if req. ke andar files array exists
//     if (req.files && req.files.length > 0) {
//         /// for multiple images upload
//         const newImages = req.files.map((file) => ({
//             url: file.path,
//             filename: file.filename
//         }));

//         updatedListing.images = newImages;
//         // Also set the first image as the main image for backward compatibility
//         updatedListing.image = newImages[0];

//         await updatedListing.save();
//     }
//     //Using the flash here  to pop message 
//     req.flash("success", " Listings Updated Successfully!")

//     res.redirect(`/listings/${id}`)
// }

// // 7. delete route


// module.exports.delete = async(req, res) => {
//     let { id } = req.params;
//     const deleted_Listing = await listing.findByIdAndDelete(id);
//     console.log(deleted_Listing)

//     //Using the flash here  to pop message 
//     req.flash("success", " Listings Deleted Successfully!")


//     res.redirect('/listings')
// }






// UPDATED CODE


const Listing = require("../models/listing");

// ================= INDEX =================
module.exports.index = async(req, res) => {
    try {
        let filter = {};

        if (req.query.category) {
            filter.category = req.query.category.toLowerCase();
        }

        if (req.query.search) {
            const searchTerm = req.query.search;

            filter.$or = [
                { title: { $regex: searchTerm, $options: "i" } },
                { category: { $regex: searchTerm, $options: "i" } }
            ];
        }

        let allListings = await Listing.find(filter);

        if (!allListings.length) {
            allListings = await Listing.find({});
        }

        res.render("index.ejs", { alllistings: allListings });

    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong with search");
        res.redirect("/listings");
    }
};

// ================= NEW FORM =================
module.exports.rendernewform = (req, res) => {
    res.render("listings/new.ejs");
};

// ================= SHOW =================
module.exports.showing_all_listings = async(req, res) => {
    let { id } = req.params;

    const listing_show = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner")
        .populate("bookings");

    if (!listing_show) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    listing_show.bookings = Array.isArray(listing_show.bookings) ?
        listing_show.bookings :
        [];

    res.render("listings/show.ejs", { listing_show });
};

// ================= CREATE =================
module.exports.create_new_listings = async(req, res) => {

    let images = [];

    if (req.files && req.files.length > 0) {
        images = req.files.map(file => ({
            url: file.path,
            filename: file.filename
        }));
    }

    const newlisting = new Listing(req.body.listing);

    newlisting.owner = req.user._id;

    newlisting.images = images;

    if (images.length > 0) {
        newlisting.image = images[0];
    }

    // ===== GEOCODING =====
    if (req.body.listing.location) {
        const address = req.body.listing.location;

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;

        try {
            const response = await fetch(url, {
                headers: { "User-Agent": "wanderlust-app" }
            });

            const data = await response.json();

            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);

                newlisting.geometry = {
                    type: "Point",
                    coordinates: [lon, lat]
                };
            }
        } catch (err) {
            console.log("Geocoding error:", err);
        }
    }

    await newlisting.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

// ================= EDIT =================
module.exports.edit_listings = async(req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image ? .url || "";
    if (originalImageUrl) {
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    }

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// ================= UPDATE =================
module.exports.update_listings_form = async(req, res) => {
    let { id } = req.params;

    const updatedListing = await Listing.findByIdAndUpdate(
        id, {...req.body.listing }, { new: true }
    );

    if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => ({
            url: file.path,
            filename: file.filename
        }));

        // ✅ PUSH (important fix)
        updatedListing.images.push(...newImages);

        updatedListing.image = updatedListing.images[0];

        await updatedListing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

// ================= DELETE =================
module.exports.delete = async(req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};