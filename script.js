const supabase = window.supabase.createClient(
    "https://wrhbiphhwvuogngynmgx.supabase.co",
    "sb_publishable_C7Xeu1BKUj0ZzFCnlbr_rg_8YI9Ecf_"
);

async function loadVotes() {
    const { data, error } = await supabase
        .from("votes")
        .select("*")
        .eq("id", 1)
        .single();

    if (error) return console.error(error);

    document.querySelector(".grba-span").textContent = data.grba;
    document.querySelector(".crni-span").textContent = data.crni;
}

loadVotes();

document.querySelector(".grba").addEventListener("click", async () => {
    const { data } = await supabase
        .from("votes")
        .select("grba")
        .eq("id", 1)
        .single();

    await supabase
        .from("votes")
        .update({ grba: data.grba + 1 })
        .eq("id", 1);

    loadVotes();
});

document.querySelector(".crni").addEventListener("click", async () => {
    const { data } = await supabase
        .from("votes")
        .select("crni")
        .eq("id", 1)
        .single();

    await supabase
        .from("votes")
        .update({ crni: data.crni + 1 })
        .eq("id", 1);

    loadVotes();
}); // ovo je sve chatgpt
