const listing = require("../models/listing");
// 1. listings route

// forward geocoding
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");



//listings == schemaaa of listings
// module.exports.index = async(req, res) => {

//     // whenver our mongo query used we use the ####  async funn
//     const alllistings = await listing.find({})
//     res.render("index.ejs", { alllistings });
// }


/// CHAt VERSOIN WITH SERCH BAR FEATURE
const Listing = require("../models/listing.js"); // path ko check karo

module.exports.index = async(req, res) => {
    try {
        let filter = {};

        // Agar category URL me aaye
        if (req.query.category) {
            filter.category = req.query.category.toLowerCase();
        }

        // Agar search bar me kuch type kiya ho
        if (req.query.search) {
            const searchTerm = req.query.search.toLowerCase();

            // Title ya category me match ho
            filter.$or = [
                { title: { $regex: searchTerm, $options: "i" } },
                { category: { $regex: searchTerm, $options: "i" } }
            ];
        }

        // Listings fetch karo
        let allListings = await Listing.find(filter);

        // Agar koi match nahi mila, fallback: sab listings show karo
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
//2. NEW route

module.exports.rendernewform = (req, res) => {

    console.log(req.user);
    // this help isAuthenticated()     ====  method to check for a valid user 


    res.render("listings/new.ejs");
}



//3. show route

module.exports.showing_all_listings = async(req, res) => {
    let { id } = req.params;

    const listing_show = await listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        },
    }).populate("owner");
    // here listing is table / collection name


    /// # if does not find the listings it show popup ##  not the Error
    if (!listing_show) {
        req.flash("error", "Listings you requesting is does not exsits !");
        res.redirect("/listings")
    }
    console.log(listing_show);

    res.render("listings/show.ejs", { listing_show })
        // path   ==  /folder/file

}



//4. create route



module.exports.create_new_listings = async(req, res, next) => {

    /// for image upload
    let url = req.file.path; //  path se hamko uska link mil jyega imge ka
    // file tumhari obj jo sari info of image h 

    let filename = req.file.filename;

    console.log(filename, "......", url);


    if (!req.body.listing) {
        throw new Express_Error(400, "Send a valid data for listings")


    }

    const newlisting = new listing(req.body.listing);
    //listing (bahar wla bracket  k)=== table name model(schema),,,,  req.body.listing se jo 
    // from se object aa ra   usko  variable me dal ke save kar wa re h
    //listing(indar wla)  == js object

    //$$  to dispaly the cuurent owner name 
    newlisting.owner = req.user._id;
    console.log(req.user)

    newlisting.image = { url, filename }



    // ===== Forward geocoding =====
    if (req.body.listing.location) {
        const address = req.body.listing.location;

        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;

        try {
            const response = await fetch(geocodeUrl, {
                headers: {
                    "User-Agent": "wanderlust-app" // Nominatim ke liye required hota hai
                }
            });

            const data = await response.json();

            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);

                newlisting.location = address;

                // ✅ CORRECT FORMAT FOR GEOJSON
                newlisting.geometry = {
                    type: "Point", // Capital P
                    coordinates: [lon, lat] // [longitude, latitude]
                };

                console.log("Latitude:", lat, "Longitude:", lon);
            } else {
                console.log("Address not found:", address);
            }
        } catch (err) {
            console.error("Geocoding error:", err);
        }
    }




    // new data ka insatnce (object)  tyarrr  and save()
    const saved_listings = await newlisting.save();
    console.log(saved_listings)
        //Using the flash here  to pop message 
    req.flash("success", "New Listings created Successfully!")


    res.redirect("/listings")
}

///5 . edit route 


module.exports.edit_listings = async(req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id);

    /// # if does not find the listings it show popup ##  not the Error
    if (!Listing) {
        req.flash("error", "Listings you requesting is does not exsits !");
        res.redirect("/listings")
    }


    // //Using the flash here  to pop message 
    req.flash("success", " Listings Edited Successfully!")


    /// for low qulatiy image preview of original listing img on the edit page 
    let originalImageUrl = Listing.image.url;
    originalImageUrl = originalImageUrl.replace("upload", "/upload/w_250")

    res.render("listings/edit.ejs", { Listing, originalImageUrl })
}


//6.update listings


module.exports.update_listings_form = async(req, res) => {

    // if (!req.body.listing) {
    //     throw new Express_Error(400, "Send a valid data for listings")
    // } // for error handling === agar form se object khaalii chalee jye Too

    let { id } = req.params;

    // check for the athurisation 
    // user is that jisne ki listings ko banaya h
    // const checklisting = await listing.findByIdAndUpdate(id);
    // if (!checklisting.owner._id.equals(res.locals.currUser._id)) {
    //     req.flash("error", "Access denied! Insufficient permissions 🔒")

    //     return res.redirect(`/listings/${id}`)
    // }

    const updatedListing = await listing.findByIdAndUpdate(id, {...req.body.listing });


    //@@  NEW IMAGE UPPLOAD LOGIC
    // check if req. ke andar file obj exists krti h ni khali obj jyegi aor server crash
    if (typeof req.file !== "undefined") {
        /// for image upload
        let url = req.file.path; //  path se hamko uska link mil jyega imge ka
        // file tumhari obj jo sari info of image h 

        let filename = req.file.filename;

        updatedListing.image = { url, filename }

        await updatedListing.save();
    }
    //Using the flas h here  to pop message 
    req.flash("success", " Listings Updated Successfully!")

    res.redirect(`/listings/${id}`)
}

// 7. delete route


module.exports.delete = async(req, res) => {
    let { id } = req.params;
    const deleted_Listing = await listing.findByIdAndDelete(id);
    console.log(deleted_Listing)

    //Using the flash here  to pop message 
    req.flash("success", " Listings Deleted Successfully!")


    res.redirect('/listings')
}